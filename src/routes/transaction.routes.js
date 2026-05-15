const express = require('express');
const router = express.Router();
const transCtrl = require('../controllers/transaction.controller');

// --- TRANSACTION & BILLING ROUTES ---
// Authentication and user ownership checks are handled directly inside the controller methods.

// Record a new payment
router.post('/checkout', transCtrl.createTransaction);

// View personal billing history
router.get('/history', transCtrl.getMyTransactions);

module.exports = router;