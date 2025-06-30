import express from "express";
import { deleteOrder, getOrder, getOrderById, updateOrderStatus } from "../Controllers/OrderController.js";
import { isAdmin, verifyToken } from "../middleware/Verification.js";

const router = express.Router();

router.get("/",isAdmin, getOrder);
router.get("/:id",isAdmin, getOrderById);
router.put("/:id/delivery",isAdmin,getOrderById);
router.put("/:id/status",isAdmin,updateOrderStatus);
router.delete("/:id",isAdmin, deleteOrder);

export default router;