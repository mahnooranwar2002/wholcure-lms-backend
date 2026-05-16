const express = require('express');
const router = express.Router();
// Double-check if your controller file has one 'l' or two!
const enrollCtrl = require('./src/controllers/enrollment.controller');

// --- STUDENT ENROLLMENT ROUTES ---
router.post('/enroll', enrollCtrl.enrollInCourse);
router.patch('/progress/:courseId', enrollCtrl.updateProgress);

module.exports = router;