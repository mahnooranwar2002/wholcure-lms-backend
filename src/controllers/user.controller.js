const User = require('../models/users.model.js');
const jwt = require('jsonwebtoken');
// Leveraging your existing utilities
const asyncHandler = require('../config/utils/asyncHandler');
const { successResponse, notFoundResponse, errorResponse } = require('../config/utils/apiResponse');

/**
 * @desc Get all users for the Admin Table (Self-Protected)
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
    // 1. Inline Authorization Check
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return errorResponse(res, "Not authorized, token missing", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') {
        return errorResponse(res, "Not authorized. Admin role required.", 403);
    }

    // 2. Logic Execution
    const users = await User.find().select('-password');
    return successResponse(res, "Users database table fetched successfully", users);
});

/**
 * @desc User Impersonation logic (Self-Protected)
 */
exports.impersonateUser = asyncHandler(async (req, res) => {
    // 1. Inline Authorization Check
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return errorResponse(res, "Not authorized, token missing", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser || currentUser.role !== 'admin') {
        return errorResponse(res, "Not authorized. Admin role required.", 403);
    }

    // 2. Find target user
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return notFoundResponse(res, "Target user not found");

    // 3. Generate the impersonation JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return errorResponse(res, "JWT Secret configuration missing from the server environment", 500);
    }

    const impersonationToken = jwt.sign(
        { 
            id: targetUser._id, 
            role: targetUser.role, 
            isImpersonating: true,
            impersonatedBy: currentUser._id 
        }, 
        secret,
        { expiresIn: '2h' } 
    );

    return successResponse(res, `Now logged in as ${targetUser.name}`, {
        token: impersonationToken,
        user: {
            _id: targetUser._id,
            name: targetUser.name,
            email: targetUser.email,
            role: targetUser.role
        }
    });
});