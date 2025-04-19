// feedback.route.js
import express from "express";
import { 
    getFeedback, 
    checkFeedbackStatus,
    submitFeedback,
    getCourseFacultyDetails,
    getCourseDetails,
    getGlobalstatus,
    setGlobalstatus
} from "../controllers/feedback.controller.js";

const router = express.Router();

router.get("/faculty/:facultyId/:courseCode", getFeedback);
router.get("/status/:userId/:courseCode/:facultyId", checkFeedbackStatus);
router.post("/submit", submitFeedback);
router.get("/course/:courseCode/faculty", getCourseFacultyDetails);
router.get("/course/:courseCode/details", getCourseDetails);
router.get("/admin/status",getGlobalstatus);
router.post("/admin/set",setGlobalstatus);
export default router;