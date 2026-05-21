const express = require('express');
const router = express.Router();
const enrollCtrl = require('../controllers/enrollment.controller');

// --- STUDENT ENROLLMENT ROUTES ---

// POST: /api/v1/enrollment/enroll
router.post('/enroll', enrollCtrl.enrollInCourse);

// PATCH: /api/v1/enrollment/progress/:courseId
router.patch('/progress/:courseId', enrollCtrl.updateProgress);

module.exports = router;