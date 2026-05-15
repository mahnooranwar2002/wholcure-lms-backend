const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, 
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }, 
    amount: { 
        type: Number, 
        required: true 
    }, 
    paymentId: { 
        type: String, 
        unique: true 
    }, 
    status: { 
        type: String, 
        enum: ['SUCCESS', 'FAILED', 'PENDING'],
        default: 'PENDING'
    }
}, { timestamps: true }); // Added timestamps to track when payments happen

module.exports = mongoose.model('Transaction', transactionSchema);