import Cart from "../Models/CartModel.js";
import Product from "../Models/ProductModel.js";
import mongoose from "mongoose";

// Helper to get or create cart
const getCurrentCart = async (req) => {
  try {
    let cart;
    
    if (req.user) {
      // For authenticated users
      cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product', 'name price');
      
      if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
      }
    } else {
      // For guest users - ensure session exists
      if (!req.session) {
        throw new Error("Session middleware not configured");
      }
      
      if (!req.session.cartId) {
        cart = await Cart.create({ items: [] });
        req.session.cartId = cart._id;
      } else {
        cart = await Cart.findById(req.session.cartId)
          .populate('items.product', 'name price');
        
        if (!cart) {
          cart = await Cart.create({ items: [] });
          req.session.cartId = cart._id;
        }
      }
    }
    
    return cart;
  } catch (error) {
    console.error('Error in getCurrentCart:', error);
    throw error;
  }
};

// Calculate cart metrics
const calculateCartMetrics = (cart) => {
  const subtotal = cart.items.reduce((sum, item) => 
    sum + (item.product?.price || 0) * item.quantity, 0);
  
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shipping;
  
  return {
    subtotal,
    shipping,
    tax,
    total,
    cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    items: cart.items.map(item => ({
      ...item.toObject(),
      price: item.product.price,
      
    }))
  };
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const cart = await getCurrentCart(req);
    const existingItem = cart.items.find(item => 
      item.product._id.toString() === productId
    );
    
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }
    
    await cart.save();
    const updatedCart = await getCurrentCart(req);
    
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

// Get cart
export const getCart = async (req, res) => {
  try {
    const cart = await getCurrentCart(req);
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    res.json({
      success: true,
      ...calculateCartMetrics(cart)
    });
    
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      error: "Failed to get cart",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId, removeAll = false } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    const cart = await getCurrentCart(req);
    const itemIndex = cart.items.findIndex(
      item => item.product._id.toString() === productId
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
    const updatedCart = await getCurrentCart(req);
    
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