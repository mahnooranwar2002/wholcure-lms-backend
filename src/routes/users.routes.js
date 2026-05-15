const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller'); // Fixes missing controller mismatch
const User = require('../models/user.model.js'); // FIXED: Changed 'users' to 'user' to prevent Module Not Found
const jwt = require('jsonwebtoken');
const asyncHandler = require('../config/utils/asyncHandler');
const { successResponse, notFoundResponse, errorResponse } = require('../config/utils/apiResponse');

// @route   GET /api/users/profile
// @desc    Get current user's profile information
router.get('/profile', asyncHandler(async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return errorResponse(res, "Not authorized, token missing", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
        return notFoundResponse(res, "User profile not found");
    }

    return successResponse(res, "User profile retrieved successfully", user);
}));

// @route   GET /api/users/admin-table
router.get('/admin-table', userCtrl.getAllUsers);

// @route   POST /api/users/impersonate/:id
router.post('/impersonate/:id', userCtrl.impersonateUser);

module.exports = router;