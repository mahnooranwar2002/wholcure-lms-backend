/**
 * Universal API Response Utility
 */

// Success Response
exports.successResponse = (res, msg, data) => {
    const resData = {
        status: true,
        message: msg,
        data: data
    };
    return res.status(200).json(resData);
};

// Error Response
exports.errorResponse = (res, msg) => {
    const resData = {
        status: false,
        message: msg
    };
    return res.status(500).json(resData);
};

// Not Found Response
exports.notFoundResponse = (res, msg) => {
    const resData = {
        status: false,
        message: msg
    };
    return res.status(404).json(resData);
};

// Unauthorized Response
exports.unauthorizedResponse = (res, msg) => {
    const resData = {
        status: false,
        message: msg
    };
    return res.status(401).json(resData);
};