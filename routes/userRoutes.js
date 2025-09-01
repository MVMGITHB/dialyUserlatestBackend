import express from "express";
import { registerUser, loginUser, logoutUser, verifyEmail } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify-email", verifyEmail);

export default router;
