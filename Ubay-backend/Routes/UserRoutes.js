import express from "express";
import { deleteUser, getALLUser, getUser, updateUserProfile } from "../Controllers/UserController";
import { isAdmin, verifyToken, verifyUser } from "../middleware/Verification";

const router = express.Router();

router.get("/",verifyToken,isAdmin, getALLUser);
router.get("/:id",verifyToken, verifyUser, getUser);
router.put("/:id",verifyToken, verifyUser, updateUserProfile);
router.delete("/:id",verifyToken, isAdmin, deleteUser);