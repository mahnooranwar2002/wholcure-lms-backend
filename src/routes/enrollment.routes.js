const express = require('express');
const router = express.Router();
const enrollCtrl = require('../controllers/enrollment.controller');

// ⚠️ Kisi ek auth middleware ki zaroorat zaroor hogi jo token verify karke req.user set kare
// Apne project ke actual auth middleware ka path yahan dein:
const { verifyJWT } = require('../middlewares/auth.middleware'); 

// --- STUDENT ENROLLMENT ROUTES ---

// POST: /api/v1/enrollment/enroll
router.post('/enroll', verifyJWT, enrollCtrl.enrollInCourse);

// PATCH: /api/v1/enrollment/progress/:courseId
router.patch('/progress/:courseId', verifyJWT, enrollCtrl.updateProgress);

module.exports = router;