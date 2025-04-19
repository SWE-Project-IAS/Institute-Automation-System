import express from "express";
import { getCourseAnnouncements, addCourseAnnouncement, deleteCourseAnnouncement, updateCourseAnnouncement, getFacultyAnnouncements } from "../controllers/announcements.controller.js";
import { getCourseStudents, getFacultyCourses, handleRequestApprovalFaculty,getPendingRequestsFaculty, getFacultyDashboardCourses, getFaculty } from "../controllers/faculty.controller.js";


const router = express.Router();

// router.get('/', getByIds);
router.get('/:id', getFaculty);
router.get('/:id/courses', getFacultyCourses);
router.get('/:id/announcements', getFacultyAnnouncements);
router.get('/courses/:courseId/announcements', getCourseAnnouncements);
router.post('/courses/:courseId/announcements/add', addCourseAnnouncement);
router.put('/courses/:courseId/announcements/:announcementId/update', updateCourseAnnouncement);
router.delete('/courses/:courseId/announcements/:announcementId/delete', deleteCourseAnnouncement);
router.get('/courses/:courseId/students', getCourseStudents);

router.get('/:id/pending-requests-approval', getPendingRequestsFaculty);
router.put('/approval-requests/:requestId', handleRequestApprovalFaculty);
// Add new route
router.get('/:id/dashboard-courses', getFacultyDashboardCourses);

export default router;