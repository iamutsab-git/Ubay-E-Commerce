import express from "express";
import { addToCart, getCart, removeFromCart } from "../Controllers/CartController.js";


const router = express.Router()

router.get("/",getCart);
router.post("/add", addToCart);
router.delete("/remove", removeFromCart);


export default router;