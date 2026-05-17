const jwt = require("jsonwebtoken");

/**
 * verifyToken
 * -----------
 * Extracts the Bearer token from the Authorization header,
 * verifies it against JWT_SECRET, and appends the decoded
 * payload to req.user so downstream controllers can read it.
 *
 * Authorization header format:
 *   Authorization: Bearer <token>
 *
 * Responses:
 *   401 Unauthorized  – token missing or header malformed
 *   403 Forbidden     – token present but invalid / expired
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // 1. Check header exists and has the correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
      error: "MISSING_TOKEN",
    });
  }

  // 2. Extract the raw token string (everything after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify signature and expiry; throws if invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach decoded payload to request for controller use
    // decoded = { user_id, role, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    // jwt.verify throws TokenExpiredError or JsonWebTokenError
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token has expired. Please log in again.",
        error: "TOKEN_EXPIRED",
      });
    }
    return res.status(403).json({
      success: false,
      message: "Invalid token. Authentication failed.",
      error: "INVALID_TOKEN",
    });
  }
}

/**
 * requireAdmin
 * ------------
 * Must be used AFTER verifyToken.
 * Checks that the authenticated user has the "admin" role.
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
      error: "INSUFFICIENT_ROLE",
    });
  }
  next();
}

module.exports = { verifyToken, requireAdmin };
