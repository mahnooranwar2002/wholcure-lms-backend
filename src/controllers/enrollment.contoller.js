const Enrollment = require('../models/enrollment.model.js');

// Enroll a student in a course
exports.enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user.id; // From protect middleware

        // Check if already enrolled
        const existing = await Enrollment.findOne({ studentId, courseId });
        if (existing) return res.status(400).json({ message: "Already enrolled" });

        const enrollment = await Enrollment.create({ studentId, courseId });
        res.status(201).json({ message: "Enrolled successfully", enrollment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update student progress
exports.updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;
        const enrollment = await Enrollment.findOneAndUpdate(
            { studentId: req.user.id, courseId: req.params.courseId },
            { 
                progress, 
                status: progress === 100 ? 'COMPLETED' : 'ACTIVE' 
            },
            { new: true }
        );
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};