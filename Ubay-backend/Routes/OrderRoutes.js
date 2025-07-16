import express from "express";
import { createOrder, deleteOrder, getOrder, getOrderById, updateOrderStatus, updateOrderToDelivered } from "../Controllers/OrderController.js";

const router = express.Router();
router.post('/', createOrder);
router.get("/", getOrder);
router.get("/:id",getOrderById);
router.put("/:id/delivery",updateOrderToDelivered);
router.put("/:id/status",updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;