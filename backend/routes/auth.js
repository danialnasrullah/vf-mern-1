//JWTMIDDLEWAREJWTMIDDLEWAREJWTMIDDLEWARE

/**
 * JWT Authentication Middleware
 * This middleware checks for a JWT in the Authorization header.
 * If the token is valid, it attaches the user info to req.user and calls next().
 * If not, it returns a 401 Unauthorized error.
 */

const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  // Get the token from the Authorization header (format: "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // Extract the token part
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using your secret
    const decoded = jwt.verify(token, '69f3b75e3ab0ad1c'); // Use your actual secret here

    // Attach user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * Authorization Middleware (Role-Based Access Control)
 * This is a higher-order function that takes an array of allowed roles.
 * It returns a middleware that checks if the authenticated user's role
 * is present in the list of allowed roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user should be attached by the authenticateJWT middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

module.exports = { authenticateJWT, authorize }; // <-- Make sure to export the new function

//JWTMIDDLEWAREJWTMIDDLEWAREJWTMIDDLEWARE
