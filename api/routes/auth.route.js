import express from "express";
import { login, refresh, logout, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post('/forgot-password', forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;