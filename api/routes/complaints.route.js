import express from "express";
import { createComplaint, deleteComplaint, getAllComplaints, getUserComplaints , updateStatus } from "../controllers/complaints.controller.js";

const router = express.Router();

router.get('/', getUserComplaints);
router.get('/admin', getAllComplaints);
router.post('/create', createComplaint);
router.delete('/delete', deleteComplaint);
router.patch('/admin/updateStatus', updateStatus);

export default router;