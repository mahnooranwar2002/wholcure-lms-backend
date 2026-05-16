const Transaction = require('../models/transaction.model.js');
const Enrollment = require('../models/enrolment.model.js');

// Create a new transaction (and enroll user if success)
exports.createTransaction = async (req, res) => {
    try {
        const { courseId, amount, paymentId, status } = req.body;
        const userId = req.user.id; // From protect middleware

        const transaction = await Transaction.create({
            userId,
            courseId,
            amount,
            paymentId,
            status
        });

        // If payment is successful, automatically enroll the student
        if (status === 'SUCCESS') {
            await Enrollment.create({
                studentId: userId,
                courseId: courseId,
                status: 'ACTIVE'
            });
        }

        res.status(201).json({ 
            message: status === 'SUCCESS' ? "Payment successful and enrolled" : "Transaction recorded", 
            transaction 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's transaction history
exports.getMyTransactions = async (req, res) => {
    try {
        const history = await Transaction.find({ userId: req.user.id }).populate('courseId', 'title');
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};