const Enrollment = require('../models/enrollment.model.js');
const asyncHandler = require('../config/utils/asyncHandler.js'); 
const ApiResponse = require('../config/utils/apiResponse.js'); 

// 1. Enroll a student in a course
exports.enrollInCourse = asyncHandler(async (req, res) => {
    // 💡 Auth middleware nahi hai, isliye studentId body se le rahe hain
    const { courseId, studentId } = req.body; 

    if (!studentId || !courseId) {
        return res.status(400).json(
            new ApiResponse(400, null, "studentId and courseId are required")
        );
    }

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
exports.updateProgress = asyncHandler(async (req, res) => {
    const { progress, studentId } = req.body; // 💡 studentId also from body here

    if (!studentId) {
        return res.status(400).json(
            new ApiResponse(400, null, "studentId is required")
        );
    }

    const enrollment = await Enrollment.findOneAndUpdate(
        { studentId, courseId: req.params.courseId },
        { 
            progress, 
            status: Number(progress) === 100 ? 'COMPLETED' : 'ACTIVE' 
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