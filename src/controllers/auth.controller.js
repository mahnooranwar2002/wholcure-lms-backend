const User = require('../models/user.model'); // Matches your auth.model.js
const jwt = require('jsonwebtoken');
// FIXED: Path now correctly goes up one level to 'src', then into 'utils'
const asyncHandler = require('../config/utils/asyncHandler');
const { successResponse, notFoundResponse, errorResponse } = require('../config/utils/apiResponse');

// --- ADMIN & AUTH FUNCTIONS ---

/**
 * @desc Update User Role
 */
exports.updateUserRole = asyncHandler(async (req, res) => {
    const { userId, newRole } = req.body; 
    
    if (!userId || !newRole) {
        return errorResponse(res, "Please provide both userId and newRole", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { role: newRole }, 
        { new: true, runValidators: true } 
    );

    if (!updatedUser) {
        return notFoundResponse(res, "User not found with the provided ID");
    }

    return successResponse(res, "Role updated successfully", updatedUser);
});

/**
 * @desc User Impersonation logic
 */
exports.impersonate = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return errorResponse(res, "User ID is required in URL parameters", 400);
    }

    const targetUser = await User.findById(userId);
    
    if (!targetUser) {
        return notFoundResponse(res, "Target user not found");
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

    const impersonationToken = jwt.sign(
        { id: targetUser._id, role: targetUser.role, isImpersonating: true }, 
        secret,
        { expiresIn: '2h' } 
    );

    return successResponse(res, `Now logged in as ${targetUser.name}`, {
        token: impersonationToken
    });
});

/**
 * @desc Bulk Suspension logic
 */
exports.bulkSuspend = asyncHandler(async (req, res) => {
    const { userIds } = req.body; 

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return errorResponse(res, "userIds must be a non-empty array", 400);
    }
    
    const updateResult = await User.updateMany(
        { _id: { $in: userIds } }, 
        { isVerified: false }
    );

    return successResponse(res, `${updateResult.modifiedCount} users have been suspended`);
});