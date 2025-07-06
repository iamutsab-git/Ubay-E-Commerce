import express from "express";
import upload from "../middleware/upload.js"
import { addProduct, getAllProducts, getPopularProducts, getProduct, removeProduct, searchProducts, updateProduct } from "../Controllers/ProductController.js";

const router = express.Router();

router.post("/addproduct", upload.array("images",5), addProduct);
router.put("/:id",upload.array("images",5),updateProduct);
router.delete("/:id",removeProduct);
router.get("/popular",getPopularProducts);
router.get("/search",searchProducts);

router.get("/",getAllProducts);
router.get("/:id",getProduct);



export default router