import express from "express";
import { studentLeave } from "../controllers/hostel.controller.js";

const router=express.Router();

router.post("/studentLeave",studentLeave)

export default router;