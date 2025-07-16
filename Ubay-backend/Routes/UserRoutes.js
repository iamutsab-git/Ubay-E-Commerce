import express from "express";
import { deleteUser, getALLUser, getUser, updateUserProfile, updateUserRole} from "../Controllers/UserController.js";
import { isAdmin, verifyToken, verifyUser } from "../middleware/Verification.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getALLUser);
router.get("/:id",verifyToken, verifyUser, getUser);
router.put("/:id", upload.single('avatar'),updateUserProfile);
router.put("/:id/role", updateUserRole);
router.delete("/:id",verifyToken, isAdmin, deleteUser);

export default router;
