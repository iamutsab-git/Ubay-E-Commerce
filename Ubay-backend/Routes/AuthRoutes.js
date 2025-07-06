import express from "express";
import { login, logout, register} from "../Controllers/AuthController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);

export default router