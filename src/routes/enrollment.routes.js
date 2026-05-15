const express = require('express');
const router = express.Router();
const enrollCtrl = require('../controllers/enrollment.controller');

// --- STUDENT ENROLLMENT ROUTES ---
router.post('/enroll', enrollCtrl.enrollInCourse);
router.patch('/progress/:courseId', enrollCtrl.updateProgress);

module.exports = router;