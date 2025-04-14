import express from "express";
import { 
    getStudent, 
    getStudentCourses,
    dropCourse,
    getStudentBonafideDetails, 
    createBonafideApplication,
    getBonafideApplications,
    getStudentPassportDetails,
    submitPassportApplication,
    getPassportApplications
} from "../controllers/student.controller.js";


const router = express.Router();
router.get("/:id", getStudent);
router.get("/:id/courses", getStudentCourses);
router.delete("/:id/courses/:courseId",dropCourse);

// Bonafide routes
router.get("/:id/bonafide", getStudentBonafideDetails);
router.post("/:id/bonafide/apply", createBonafideApplication);
router.get("/:id/bonafide/applications", getBonafideApplications);

// Passport routes
router.get('/:id/passport', getStudentPassportDetails);
router.post('/:id/passport/apply', submitPassportApplication);
router.get('/:id/passport/applications', getPassportApplications);

export default router;