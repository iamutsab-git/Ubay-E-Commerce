import Cart from "../Models/CartModel.js";
import Product from "../Models/ProductModel.js";
import mongoose from "mongoose";

// Helper to get or create cart with safe population
const getCurrentCart = async (req) => {
  try {
    let cart;
    
    if (req.user) {
      // For authenticated users
      cart = await Cart.findOne({ user: req.user._id })
        .populate({
          path: 'items.product',
          select: 'name price',
          model: 'Product'
        });
      
      if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
      }
    } else {
      // For guest users
      if (!req.session) {
        throw new Error("Session middleware not configured");
      }
      
      if (!req.session.cartId) {
        cart = await Cart.create({ items: [] });
        req.session.cartId = cart._id;
      } else {
        cart = await Cart.findById(req.session.cartId)
          .populate({
            path: 'items.product',
            select: 'name price',
            model: 'Product'
          });
        
        if (!cart) {
          cart = await Cart.create({ items: [] });
          req.session.cartId = cart._id;
        }
      }
    }
    
    // Clean any invalid items before returning
    if (cart) {
      cart.items = cart.items.filter(item => 
        item.product && 
        item.product._id && 
        typeof item.product.price === 'number'
      );
      await cart.save();
    }
    
    return cart;
  } catch (error) {
    console.error('Error in getCurrentCart:', error);
    throw error;
  }
};

// Safe calculation of cart metrics
const calculateCartMetrics = (cart) => {
  // Filter out any invalid items first
  const validItems = cart.items.filter(item => 
    item && 
    item.product && 
    typeof item.product.price === 'number' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );

  const subtotal = validItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0);
  
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    cartCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
    items: validItems.map(item => ({
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price
      },
      quantity: item.quantity
    }))
  };
};

// Add to cart with additional validation
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product || typeof product.price !== 'number') {
      return res.status(404).json({ error: "Valid product not found" });
    }
    
    const cart = await getCurrentCart(req);
    const existingItem = cart.items.find(item => 
      item.product && 
      item.product._id.toString() === productId
    );
    
    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      cart.items.push({ 
        product: productId, 
        quantity: parsedQuantity 
      });
    }
    
    await cart.save();
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'name price',
        model: 'Product'
      });
    
    res.json({
      success: true,
      ...calculateCartMetrics(updatedCart)
    });
    
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      error: "Failed to add to cart",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get cart with additional safety checks
export const getCart = async (req, res) => {
  try {
    const cart = await getCurrentCart(req);
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    // Double-check population
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'name price',
        model: 'Product'
      });
    
    res.json({
      success: true,
      ...calculateCartMetrics(populatedCart)
    });
    
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      error: "Failed to get cart",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove from cart with validation
export const removeFromCart = async (req, res) => {
  try {
    const { productId, removeAll = false } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    const cart = await getCurrentCart(req);
    const itemIndex = cart.items.findIndex(
      item => item.product && item.product._id.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }
    
    if (removeAll || cart.items[itemIndex].quantity <= 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity -= 1;
    }
    
    await cart.save();
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'name price',
        model: 'Product'
      });
    
    res.json({
      success: true,
      ...calculateCartMetrics(updatedCart)
    });
    
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      error: "Failed to remove from cart",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};