const Enrollment = require('../models/enrollment.model.js');
const asyncHandler = require('../middlewares/asyncHandler.middleware.js'); // Apne sahi path se import karein
const ApiResponse = require('../utils/ApiResponse.js'); // Apne sahi path se import karein

// 1. Enroll a student in a course
exports.enrollInCourse = asyncHandler(async (req, res, next) => {
    const { courseId } = req.body;
    const studentId = req.user._id || req.user.id; // Jo bhi aapki auth middleware payload structure ho

    // Check if already enrolled
    const existing = await Enrollment.findOne({ studentId, courseId });
    if (existing) {
        return res.status(400).json(
            new ApiResponse(400, null, "You are already enrolled in this course")
        );
    }

    const enrollment = await Enrollment.create({ studentId, courseId });
    
    return res.status(201).json(
        new ApiResponse(201, enrollment, "Enrolled successfully")
    );
});

// 2. Update student progress
exports.updateProgress = asyncHandler(async (req, res, next) => {
    const { progress } = req.body;
    const studentId = req.user._id || req.user.id;

    const enrollment = await Enrollment.findOneAndUpdate(
        { studentId, courseId: req.params.courseId },
        { 
            progress, 
            status: progress === 100 ? 'COMPLETED' : 'ACTIVE' 
        },
        { new: true }
    );

    if (!enrollment) {
        return res.status(404).json(
            new ApiResponse(404, null, "Enrollment record not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, enrollment, "Progress updated successfully")
    );
});