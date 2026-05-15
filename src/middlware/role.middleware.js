/**
 * Role Middleware Factory
 * This allows you to restrict routes to specific roles.
 * Usage in routes: authorize('ADMIN', 'MENTOR')
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // 1. Safety check: ensure req.user was populated by the protect middleware
        if (!req.user) {
            return res.status(401).json({ 
                message: "Authentication required before role authorization" 
            });
        }

        // 2. Check if the user's role is included in the allowed roles array
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access Denied: Your role (${req.user.role}) does not have permission to perform this action.` 
            });
        }

        // 3. If everything is fine, move to the controller
        next();
    };
};