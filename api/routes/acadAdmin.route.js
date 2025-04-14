import express from 'express';
import {
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    filterApplications,
    addComment
} from '../controllers/acadadmin.controller.js';

const router = express.Router();

// Document management routes
router.get('/documents/applications', getAllApplications);
router.get('/documents/applications/filter', filterApplications);
router.get('/documents/applications/:id', getApplicationById);
router.patch('/documents/applications/:id/status', updateApplicationStatus);
router.post('/documents/applications/:id/comment', addComment);

export default router;
