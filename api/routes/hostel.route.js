import express from "express";
import { studentLeave, getStudentLeave, getAllLeaves, updateAnyLeave } from "../controllers/hostel.controller.js";

const router=express.Router();

router.post("/leave",studentLeave)
router.get("/:id/leaves", getStudentLeave);
router.get("/leaves", getAllLeaves);
router.put("/leaves/:id", updateAnyLeave);

export default router;