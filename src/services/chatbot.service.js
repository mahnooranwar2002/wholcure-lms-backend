// FIX: Pointing to your actual model name 'user.model.js'
const User = require('../models/user.model.js'); 
const Course = require('../models/course.model.js');

/**
 * Basic Logic for the LMS Support Chatbot
 * This handles automated responses for common student and mentor queries.
 */
const handleChatQuery = async (userId, message) => {
    // 1. Safety Check: If no user is logged in
    if (!userId) {
        return "Please log in to ask specific questions about your account status.";
    }

    try {
        const user = await User.findById(userId);
        if (!user) return "User not found. Please try logging in again.";

        const lowerMessage = message.toLowerCase();

        // 2. Account Status Queries 
        if (lowerMessage.includes('status') || lowerMessage.includes('verified')) {
            return user.isVerified 
                ? "Your account is fully verified. You have full access to your dashboard." 
                : "Your account is currently unverified. Please check your email for the verification link.";
        }

        // 3. Course Discovery Queries
        if (lowerMessage.includes('course') || lowerMessage.includes('learn')) {
            const popularCourses = await Course.find({ status: 'PUBLISHED' }).limit(3);
            if (popularCourses.length === 0) {
                return "We are currently updating our course catalog. Check back soon!";
            }
            const courseNames = popularCourses.map(c => c.title).join(', ');
            return `You can start learning today! Our top courses include: ${courseNames}.`;
        }

        // 4. Role-Based Support 
        if (lowerMessage.includes('help')) {
            if (user.role === 'ADMIN') {
                return "Admin Mode: You can manage users, approve courses, and view the Analytics Dashboard.";
            } else if (user.role === 'MENTOR') {
                return "Mentor Mode: You can upload new courses and view your student enrollment stats.";
            } else {
                return "Student Mode: You can browse courses, track your progress, and download certificates.";
            }
        }

        return "I'm here to help with your LMS journey. Ask me about courses, your account status, or dashboard features!";
    } catch (error) {
        console.error("Chatbot Error:", error.message);
        return "I'm having a little trouble right now. Please try asking again in a moment.";
    }
};

module.exports = { handleChatQuery };