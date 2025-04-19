import express from 'express';
import {
    getFacultyCourses,
    getStudentCourses,
    createAssignment,
    getCourseAssignments,
    getCourse,
    getAssignmentDetails,
    deleteAssignmentDetails,
    editAssignmentDetails,
    submitAssignment,
    undoSubmission,
    getStudent,
    getUser
} from '../controllers/assignment.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Document management routes
router.get('/:userId', getUser); // Assuming this is for faculty as well
router.get('/student/:userId', getStudent);
router.get("/faculty/:userId/courses", getFacultyCourses);
router.get("/student/:userId/courses", getStudentCourses);
router.get("/course/:courseId/assignments", getCourseAssignments);
router.get("/course/:courseCode", getCourse);
router.post("/course/:courseId/assignments", createAssignment);
router.get("/:courseId/:assignmentId", getAssignmentDetails);
router.delete("/:courseId/:assignmentId",deleteAssignmentDetails); 
router.put("/:courseId/:assignmentId", editAssignmentDetails);
router.post('/:courseCode/:assignmentId/submit', upload.single('file'), submitAssignment);
router.delete('/:courseCode/:assignmentId/undo/:rollNo', undoSubmission);


export default router;
