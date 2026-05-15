const Course = require('../models/course.model.js');
const User = require('../models/user.model'); 
const jwt = require('jsonwebtoken');
const asyncHandler = require('../config/utils/asyncHandler');
const { successResponse, notFoundResponse, errorResponse } = require('../config/utils/apiResponse');

// ==========================================
// 1. PUBLIC ACTIONS
// ==========================================

/**
 * @desc Get all published courses
 */
exports.getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ status: 'PUBLISHED' });
    return successResponse(res, "Courses retrieved successfully", courses);
});

/**
 * @desc Fetch a single course by its slug identifier
 */
exports.getCourseBySlug = asyncHandler(async (req, res) => {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return notFoundResponse(res, "Course not found");
    return successResponse(res, "Course retrieved successfully", course);
});

/**
 * @desc Fetch courses filtered by category ID
 */
exports.getCoursesByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    if (!categoryId) return errorResponse(res, "Category ID is required", 400);

    const courses = await Course.find({ category: categoryId });
    if (courses.length === 0) {
        return successResponse(res, "No courses found in this category", []);
    }
    return successResponse(res, "Courses fetched successfully", courses);
});


// ==========================================
// 2. PROTECTED MANAGEMENT ACTIONS (Self-Protected)
// ==========================================

/**
 * @desc Create a new course (Mentors & Admins Only)
 */
exports.createCourse = asyncHandler(async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return errorResponse(res, "Not authorized, token missing", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser || (currentUser.role !== 'mentor' && currentUser.role !== 'admin')) {
        return errorResponse(res, "Forbidden: Mentor or Admin role required", 403);
    }

    const { title, description, price, thumbnail, category } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCourse = await Course.create({
        title,
        slug,
        description,
        price,
        thumbnail,
        category,
        mentorId: currentUser._id
    });

    return successResponse(res, "Course created successfully", newCourse, 201);
});

/**
 * @desc Update course content details
 */
exports.updateCourse = asyncHandler(async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return errorResponse(res, "Not authorized, token missing", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return errorResponse(res, "User profile not found", 404);

    const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedCourse) return notFoundResponse(res, "Course not found");
    return successResponse(res, "Course updated successfully", updatedCourse);
});

/**
 * @desc Delete course document entirely
 */
exports.deleteCourse = asyncHandler(async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return errorResponse(res, "Not authorized, token missing", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return errorResponse(res, "User profile not found", 404);

    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return notFoundResponse(res, "Course not found");

    return successResponse(res, "Course deleted successfully");
});

/**
 * @desc Admin Approval Pipeline: Update course approval status
 */
exports.updateCourseStatus = asyncHandler(async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return errorResponse(res, "Not authorized, token missing", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') {
        return errorResponse(res, "Not authorized. Admin role required.", 403);
    }

    const { status } = req.body; 
    if (!status) return errorResponse(res, "Status is required", 400);

    const course = await Course.findByIdAndUpdate(
        req.params.id, 
        { status }, 
        { new: true, runValidators: true } 
    );

    if (!course) return notFoundResponse(res, "Course not found");
    return successResponse(res, `Course status updated to ${status}`, course);
});