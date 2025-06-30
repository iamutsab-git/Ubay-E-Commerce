import express from "express";
import { addProduct, getAllProducts, getPopularProducts, getProduct, removeProduct, searchProducts, updateProduct } from "../Controllers/ProductController.js";

const router = express.Router();

router.post("/addproduct",addProduct);
router.put("/:id",updateProduct);
router.delete("/:id",removeProduct);
router.get("/popular",getPopularProducts);
router.get("/search",searchProducts);

router.get("/",getAllProducts);
router.get("/:id",getProduct);



export default router