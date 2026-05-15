const express = require('express');
const router = express.Router();

// Import the admin controller correctly
const adminCtrl = require('../controllers/admin.controller'); 

// --- HIGH PRIVILEGE ADMIN ROUTES ---
// Authentication & Role-Based Access Control (RBAC) are handled directly inside the controller methods

// RBAC: Change user permissions
router.patch('/update-role', adminCtrl.updateUserRole);

// User Impersonation (e.g., /api/admin/impersonate/123)
router.post('/impersonate/:id', adminCtrl.impersonate);

// Bulk Management: Bulk suspension
router.post('/bulk-suspend', adminCtrl.bulkSuspend);

module.exports = router;