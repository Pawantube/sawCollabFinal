// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel.js");
// const asyncHandler = require("express-async-handler");

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       //decodes token id
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       next();
//     } catch (error) {
//       res.status(401);
//       throw new Error("Not authorized, token failed");
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

// module.exports = { protect };
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Assuming this path is correct for your User model
const asyncHandler = require("express-async-handler"); // For simplified async error handling

// @description Middleware to protect routes by verifying JWT
// @access Private (This middleware itself protects access)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract the token from the header
      token = req.headers.authorization.split(" ")[1];

      // Input Validation: Ensure token is not empty after splitting
      if (!token) {
        res.status(401);
        throw new Error("Not authorized, token format is invalid (e.g., 'Bearer TOKEN').");
      }

      // 3. Verify the token using your JWT_SECRET
      // The process.env.JWT_SECRET MUST be set in your .env file (local)
      // and in your hosting environment (e.g., Render) for production.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Log decoded token (for development/debugging)
      console.log("JWT Decoded Payload:", decoded);

      // 4. Find the user based on the decoded ID and attach to request object
      // .select("-password") ensures password hash is not attached to req.user
      req.user = await User.findById(decoded.id).select("-password");

      // Robustness: Check if user actually exists in DB (e.g., if user was deleted after token issue)
      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user associated with token not found.");
      }

      // 5. Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Catch specific JWT errors for clearer messages
      if (error.name === "TokenExpiredError") {
        console.error("JWT Error: Token has expired.");
        res.status(401);
        throw new Error("Not authorized, token has expired.");
      } else if (error.name === "JsonWebTokenError") {
        console.error("JWT Error: Invalid token signature/format.");
        res.status(401);
        throw new Error("Not authorized, invalid token.");
      } else {
        // Catch any other errors (e.g., database connection issues during User.findById)
        console.error("Authentication Error:", error.message);
        res.status(401);
        throw new Error("Not authorized, token validation failed.");
      }
    }
  } else {
    // If no authorization header or not starting with "Bearer"
    res.status(401);
    throw new Error("Not authorized, no token provided or invalid format. Expecting 'Bearer TOKEN'.");
  }
});

module.exports = { protect };