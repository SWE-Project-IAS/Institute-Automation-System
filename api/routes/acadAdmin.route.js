import express from "express";
import {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  filterApplications,
  addComment,
    getDropRequests,
    updateDropRequestStatus,
  addFeeStructure,
  getFeeBreakdown,
  toggleFeeBreakdownStatus,
  updateFeeBreakdown,
  getStudentsWithDocumentAccess,
  updateStudentDocumentAccess,
  bulkUpdateDocumentAccess,
  addStudents,
  addFaculty,
  getAllDepartments,
} from "../controllers/acadAdmin.controller.js";
import { addAnnouncement, deleteAnnouncement, getAdminAnnouncements, updateAnnouncement } from "../controllers/announcements.controller.js";

const router = express.Router();

// Document management routes
router.get("/documents/applications", getAllApplications);
router.get("/documents/applications/filter", filterApplications);
router.get("/documents/applications/:id", getApplicationById);
router.patch("/documents/applications/:id/status", updateApplicationStatus);
router.post("/documents/applications/:id/comment", addComment);


// Course drop request routes (ADMIN)
router.get('/drop-requests', getDropRequests); // Get all drop requests (any status)
router.get('/drop-requests/:requestId', updateDropRequestStatus); // Get a specific drop request
router.patch('/drop-requests/:requestId', updateDropRequestStatus); // Update status/remarks

// Fee management routes
router.post("/feeControl/addFee", addFeeStructure);
router.get("/feeControl/getFeeBreakdown", getFeeBreakdown);
router.patch("/feeControl/toggleStatus/:id", toggleFeeBreakdownStatus);
router.put("/feeControl/updateFee/:id", updateFeeBreakdown);

// Document access control routes
router.get("/students/document-access", getStudentsWithDocumentAccess);
router.patch("/students/:id/document-access", updateStudentDocumentAccess);
router.post("/students/bulk-document-access", bulkUpdateDocumentAccess);

// Student management routes
router.post("/students/add-students", addStudents);
// Faculty management routes
router.post("/faculty/add-faculty", addFaculty);

// Announcement routes
router.get("/announcements", getAdminAnnouncements); 
router.post("/announcements/add", addAnnouncement);
router.put("/announcements/:announcementId/update", updateAnnouncement); 
router.delete("/announcements/:announcementId/delete", deleteAnnouncement);

// get departments
router.get("/departments", getAllDepartments);

export default router;
