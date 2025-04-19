import express from 'express';
import {
    getFacultyCourses,
    getStudentsinCourse,
    submitGrades
} from '../controllers/grades.controller.js';

const router = express.Router();

// Document management routes
router.get("/:courseId/getStudents", getStudentsinCourse);
router.get("/faculty/:userId/courses", getFacultyCourses);
router.post("/:courseId/submitGrades", submitGrades)


export default router;
