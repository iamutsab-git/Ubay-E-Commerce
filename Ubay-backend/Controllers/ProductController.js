import { cloudinary } from "../Config/cloudinary.js";
import Product from "../Models/ProductModel.js";
import mongoose from "mongoose";

// Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add Product
export const addProduct = async (req, res) => {
  const { name, price, description, category, brand, stock } = req.body;

  // Validate required fields
  if (!name || !price || !stock) {
    return res.status(400).json({
      success: false,
      message: "Name, price, and stock are required",
    });
  }

  try {
    const files = req.files || [];
    const images = [];

    // Allow up to 4 images
    if (files.length > 4) {
      return res.status(400).json({
        success: false,
        message: "Maximum 4 images allowed",
      });
    }

    // Upload images to Cloudinary if provided
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "mern_Uploads",
      });
      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
      description: description || "",
      category: category || "",
      brand: brand || "",
      stock: Number(stock),
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Remove Product
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all Cloudinary images
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Product deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, brand, stock } = req.body;

  // Validate ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (description) product.description = description;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock) product.stock = Number(stock);

    // Handle image updates
    if (req.files && req.files.length > 0) {
      if (req.files.length > 4) {
        return res.status(400).json({
          success: false,
          message: "Maximum 4 images allowed",
        });
      }

      // Delete old images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        }
      }

      // Upload new images
      const newImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "mern_Uploads",
        });
        newImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      product.images = newImages;
    }

    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Product update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Product.countDocuments();

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Popular Products
export const getPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Product.find()
      .sort({ salesCount: -1 }) // Assuming salesCount field exists
      .limit(8);

    return res.status(200).json({
      success: true,
      count: popularProducts.length,
      data: popularProducts,
    });
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching popular products",
      error: error.message,
    });
  }
};

// Search Products
export const searchProducts = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, category, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      data: products,
    });
  } catch (error) {
    console.error("Search products error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};