const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    // Standard Bearer token check
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Verify token using the same secret from your auth controller
        const decoded = jwt.verify(token, 'your_jwt_secret');
        
        // Attach the decoded payload (which should include id and role) to req.user
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Role Check Middleware
exports.authorizeAdmin = (req, res, next) => {
    // Safety check: ensure req.user exists and has the ADMIN role
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};