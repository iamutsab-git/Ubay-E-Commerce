import express from "express";
import { createOrder, deleteOrder, getOrder, getOrderById, updateOrderStatus, updateOrderToDelivered } from "../Controllers/OrderController.js";
import { isAdmin } from "../middleware/Verification.js";

const router = express.Router();
router.post('/', createOrder);
router.get("/", getOrder);
router.get("/:id",isAdmin, getOrderById);
router.put("/:id/delivery",isAdmin,updateOrderToDelivered);
router.put("/:id/status",isAdmin,updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;