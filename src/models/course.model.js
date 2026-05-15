const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    }, 
    slug: { 
        type: String, 
        unique: true 
    }, 
    description: { 
        type: String, 
        required: true 
    }, 
    price: { 
        type: Number, 
        default: 0.00 
    }, 
    thumbnail: { 
        type: String, 
        required: true 
    }, 
    mentorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, 
    status: { 
        type: String, 
        enum: ['DRAFT', 'PENDING', 'PUBLISHED'], 
        default: 'DRAFT' 
    }, 
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);