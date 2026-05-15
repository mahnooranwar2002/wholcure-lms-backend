const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller'); 

// --- ADMIN ROUTES ---
// Self-contained authorization happens inside the controller functions

router.put('/update-role', authCtrl.updateUserRole);
router.post('/impersonate/:id', authCtrl.impersonate);
router.post('/bulk-suspend', authCtrl.bulkSuspend);

module.exports = router;