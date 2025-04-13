import express from "express";
import { 
    getStudent, 
    getStudentBonafideDetails, 
    createBonafideApplication,
    getBonafideApplications 
} from "../controllers/student.controller.js";

const router = express.Router();

// Basic student routes
router.get("/:id", getStudent);

// Bonafide routes
router.get("/:id/bonafide", getStudentBonafideDetails);
router.post("/:id/bonafide/apply", createBonafideApplication);
router.get("/:id/bonafide/applications", getBonafideApplications);

export default router;