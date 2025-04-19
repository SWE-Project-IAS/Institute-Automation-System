import express from "express";
import { getAllCourses, getAllStudents, getPercentages } from "../controllers/attendance.controller.js";
import { getCourse } from "../controllers/attendance.controller.js";
import { createAttendanceRecord } from "../controllers/attendance.controller.js"; 
import { getFacultyCourses } from "../controllers/attendance.controller.js";
import { getStudents } from "../controllers/attendance.controller.js";
import { modifyAttendanceRecord } from "../controllers/attendance.controller.js";
import { createBulkAttendanceRecords } from "../controllers/attendance.controller.js";
import { getApprovalRequests } from "../controllers/attendance.controller.js";
import { approveAttendance } from "../controllers/attendance.controller.js";

const router=express.Router();


//student
router.get("/student/:courseId",getCourse)
router.get("/student/",getPercentages)

//faculty
router.get("/faculty/", getFacultyCourses)
router.get("/faculty/:id", getStudents)
router.put("/update/", modifyAttendanceRecord)
router.post("/add/",createAttendanceRecord)
router.post("/add/bulk/:id", createBulkAttendanceRecords)

//admin
router.get("/admin/", getAllCourses)
router.get("/admin/approval", getApprovalRequests)
router.patch("/admin/approval",approveAttendance)
router.get("/admin/student",getAllStudents)

export default router;