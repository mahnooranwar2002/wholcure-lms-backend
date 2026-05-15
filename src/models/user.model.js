const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, 
    email: { 
        type: String, 
        unique: true, 
        required: true 
    }, 
    password: { 
        type: String, 
        required: true 
    }, // Hashed 
    role: { 
        type: String, 
        enum: ['ADMIN', 'MENTOR', 'STUDENT'], 
        default: 'STUDENT' 
    }, 
    avatar: { 
        type: String 
    }, 
    isVerified: { 
        type: Boolean, 
        default: false 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);