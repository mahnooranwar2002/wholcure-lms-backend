const express = require('express');
const router = express.Router();
const courseCtrl = require('../controllers/course.controller'); 

// --- PUBLIC ROUTES ---
router.get('/', courseCtrl.getAllCourses);
router.get('/slug/:slug', courseCtrl.getCourseBySlug);
router.get('/category/:categoryId', courseCtrl.getCoursesByCategory);

// --- PROTECTED MANAGEMENT ROUTES ---
router.post('/create', courseCtrl.createCourse);
router.put('/update/:id', courseCtrl.updateCourse);
router.delete('/delete/:id', courseCtrl.deleteCourse);
router.patch('/status/:id', courseCtrl.updateCourseStatus);

module.exports = router;