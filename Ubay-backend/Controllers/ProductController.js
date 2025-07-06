import { cloudinary } from "../Config/cloudinary.js";
import Product from "../Models/ProductModel.js"

export const addProduct = async (req, res) => {
  const { name, price, description, category, brand, stock } = req.body;

  try {
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }

    const images = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "mern_uploads",
      });

      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const newProduct = await Product.create({
      name,
      price,
      description,
      category,
      brand,
      stock,
      images, // always an array
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
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


export const removeProduct = async(req, res)=>{
    try {
        const { id } = req.params; // Assuming you pass product ID in URL
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        //  Delete Cloudinary images if they exist
        if (product.images?.public_id) {
            await cloudinary.uploader.destroy(product.images.public_id);
        }
            return res.status(200).json({message: "Product deleted"});

    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
        console.error(error);
    }
};

export const updateProduct= async(req, res)=>{
        const { id } = req.params; // Assuming product ID is in URL
    const { name, price, description, category, brand, stock } = req.body;
    
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

            if (name) product.name= name;
            if (price) product.price= price;
            if (description) product.description= description;
            if (category) product.category = category;
            if (brand) product.brand = brand;
            if (stock) product.stock = stock;
            // If new images are uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      // Upload new images
      const newImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "mern_uploads",
        });
        newImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      // Replace images array
      product.images = newImages;
    }

            await product.save();
             return res.status(200).json({ message: "Product updated", product });
        }catch(error){
             res.status(500).json({message: "Internal Server Error"});
            console.error(error);
        }
    };

    export const getAllProducts = async(req,res)=>{
        try{
            const products = await Product.find()
            res.status(200).json({
            success: true,
            count: products.length,
            data: products
             });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Error while fetching",
            error: error.message,
        });
        console.error(error);
    }
};

export const getProduct = async(req, res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Not found"})
        }

        res.status(200).json(product);

    }catch(error){
              res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getPopularProducts = async (req, res) => {
  try {
    
    const popularProducts = await Product.find()
    //   .sort({ salesCount: -1 })  
    //   .limit(8);          

    res.status(200).json({
    //   success: true,
    //   count: popularProducts.length,
      data: popularProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching popular products",
      error: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
 const { q, minPrice, maxPrice, category } = req.query;

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

const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};
