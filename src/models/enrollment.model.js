const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, 
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }, 
    progress: { 
        type: Number, 
        min: 0, 
        max: 100, 
        default: 0 
    }, 
    status: { 
        type: String, 
        enum: ['ACTIVE', 'COMPLETED'], 
        default: 'ACTIVE' 
    }, 
    enrolledAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);