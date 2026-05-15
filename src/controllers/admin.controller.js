const User = require('../models/user.model.js'); 
const jwt = require('jsonwebtoken');

// RBAC: Change user permissions
exports.updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body; 

        // FIX: Check if input exists to prevent "Cast to ObjectId failed"
        if (!userId || !newRole) {
            return res.status(400).json({ message: "userId and newRole are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { role: newRole }, 
            { new: true, runValidators: true } // Added validation for the new role
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Role updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Impersonation
exports.impersonate = async (req, res) => {
    try {
        // FIX: Ensure ID is present in params
        if (!req.params.id) {
            return res.status(400).json({ message: "Target User ID is required" });
        }

        const targetUser = await User.findById(req.params.id);
        if (!targetUser) return res.status(404).json({ message: "Student not found" });

        // FIX: Use an environment variable for secret to prevent security leaks
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';

        const impersonationToken = jwt.sign(
            { id: targetUser._id, role: targetUser.role, isImpersonating: true }, 
            secret,
            { expiresIn: '1h' } // Added expiration so tokens don't last forever
        );

        res.status(200).json({ 
            token: impersonationToken, 
            message: `Now logged in as ${targetUser.name || 'User'}` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Bulk Management: Bulk suspension
exports.bulkSuspend = async (req, res) => {
    try {
        const { userIds } = req.body; 

        // FIX: Validate that userIds is actually an array to prevent .updateMany crash
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: "userIds must be a non-empty array" });
        }

        const result = await User.updateMany(
            { _id: { $in: userIds } }, 
            { isVerified: false }
        );

        res.status(200).json({ 
            message: "Selected users suspended successfully",
            count: result.modifiedCount 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};