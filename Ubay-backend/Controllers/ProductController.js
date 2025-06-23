import { cloudinary } from "../Config/cloudinary.js";
import Product from "../Models/ProductModel.js"

export const addProduct= async (req, res)=>{
    const {name, price,description, category,brand, stock}= req.body;
    try{
         let images = [];
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "product-images",
            });
            images = [{
                url: result.secure_url,  // ✅ Cloudinary CDN URL
                public_id: result.public_id  // ✅ Cloudinary public_id for future deletion
            }];
        }
        const newProduct = await Product.create({
            name,price,description,category,brand,
            stock,
             images,
        });
        return res.status(200).json({message:"Product created successfully.", product : newProduct });

    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
        console.error(error);
    }
};
export const removeProduct = async(req, res)=>{
    try {
        const { id } = req.params; // Assuming you pass product ID in URL
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Optional: Delete Cloudinary images if they exist
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
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "product-images",
                });
                product.images ={
                    url: result.secure_url,
                public_id: result.public_id
                };
                if (product.images?.public_id) {
                await cloudinary.uploader.destroy(product.images.public_id);
            } }

            await product.save();
             return res.status(200).json({ message: "Product updated", product });
        }catch(error){
             res.status(500).json({message: "Internal Server Error"});
            console.error(error);
        }
    };