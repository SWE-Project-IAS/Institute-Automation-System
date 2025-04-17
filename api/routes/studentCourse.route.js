// routes/facultyCourse.routes.js or create courseRegistration.routes.js
import express from "express";

import { getAvailableCoursesForRegistration,registerCourse } from "../controllers/studentCourse.controller.js";

const router = express.Router();

router.get("/getCourse/:userId", getAvailableCoursesForRegistration);
router.post('/register', registerCourse);
export default router;
