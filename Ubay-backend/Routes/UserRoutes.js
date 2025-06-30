import express from "express";
import { deleteUser, getALLUser, getUser, updateUserProfile } from "../Controllers/UserController.js";
import { isAdmin, verifyToken, verifyUser } from "../middleware/Verification.js";

const router = express.Router();

router.get("/", getALLUser);
router.get("/:id",verifyToken, verifyUser, getUser);
router.put("/:id", updateUserProfile);
router.delete("/:id",verifyToken, isAdmin, deleteUser);

export default router;
