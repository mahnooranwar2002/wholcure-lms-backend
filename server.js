const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment configurations
dotenv.config();

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json()); // Parses incoming json payloads
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. ROUTE IMPORTS & MOUNTING
// ==========================================
const adminRoutes = require('./src/routes/admin.routes');
const courseRoutes = require('./src/routes/course.routes');
const enrollmentRoutes = require('./src/routes/enrollment.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const userRoutes = require('./src/routes/user.routes');

// Mount routes to API endpoints
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/enrollment', enrollmentRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/users', userRoutes);

// Base Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP", message: "Server running smoothly" });
});

// ==========================================
// 3. FALLBACK OVERRIDE ERROR HANDLING
// ==========================================

// Global catch-all for undefined route paths (404 Mismatches)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Resource not found - Cannot execute ${req.method} on ${req.originalUrl}`
    });
});

// Global server breakdown error filter (500 Breaks)
app.use((err, req, res, next) => {
    console.error("CRITICAL ERROR LOOP:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server crash intercepted",
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// ==========================================
// 4. DATABASE CONNECT & ENGINE START
// ==========================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("CRITICAL CONFIG ERROR: 'MONGO_URI' is missing from your environmental variables.");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("🚀 MongoDB Database Connection Secured Successfully");
        app.listen(PORT, () => {
            console.log(`📡 Server Engine Deployment running on Port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Mongoose Connection Initialization Failure:", error.message);
        process.exit(1);
    });