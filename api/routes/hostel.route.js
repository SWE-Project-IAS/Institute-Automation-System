import express from "express";
import { studentLeave, getStudentLeave, getAllLeaves, updateAnyLeave } from "../controllers/hostel.controller.js";
import { hostelTransfer,getStudentTransfer, getAllTransferRequests, updateTransferRequest} from "../controllers/hostel.controller.js";
import { 
    validateMealAccess, 
    isStudent, 
    isMealAdmin 
  } from "../middleware/meal.middleware.js";
import { 
    getStudentSubscriptionInfo, 
    createMealPlanRequest, 
    getStudentMealRequestHistory, 
    getSubscriptionRequestsForAdmin, 
    processSubscriptionRequest
} from "../controllers/hostel.controller.js";

const router = express.Router();

router.post("/leave",studentLeave);
router.get("/:id/leaves", getStudentLeave);
router.get("/leaves", getAllLeaves);
router.put("/leaves/:id", updateAnyLeave);

router.post("/transfer", hostelTransfer);
router.get("/:id/transfer-requests", getStudentTransfer);
router.get("/transfer-requests", getAllTransferRequests);
router.put("/transfer-requests/:id", updateTransferRequest);


router.get("/mess/subscription", validateMealAccess, isStudent, getStudentSubscriptionInfo);
router.post("/mess/subscribe", validateMealAccess, isStudent, createMealPlanRequest);
router.get("/mess/requests/history", validateMealAccess, isStudent, getStudentMealRequestHistory);

router.get("/mess/admin/requests", validateMealAccess, isMealAdmin, getSubscriptionRequestsForAdmin);
router.put("/mess/admin/requests/:requestId", validateMealAccess, isMealAdmin, processSubscriptionRequest);

export default router;