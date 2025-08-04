// const notFound = (req, res, next) => {
//   const error = new Error(`Not Found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

// module.exports = { notFound, errorHandler };

// @description Middleware to handle requests to undefined routes (404 Not Found)
const notFound = (req, res, next) => {
  // Create a new Error object with a descriptive message
  const error = new Error(`Not Found - ${req.originalUrl}`);
  
  // Set the response status code to 404 (Not Found)
  res.status(404);
  
  // Pass the error to the next middleware in the chain, which will be the errorHandler
  next(error);
};

// @description General error handling middleware
// This middleware is executed when an error is passed via next(err)
// or thrown in an asyncHandler wrapped route.
const errorHandler = (err, req, res, next) => {
  // Determine the HTTP status code for the response.
  // If the response status code was already set to 200 (OK), it means an error
  // occurred after a successful status was implicitly/explicitly sent.
  // In such cases, default to 500 Internal Server Error. Otherwise, use the
  // status code that was explicitly set by a previous middleware/route.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set the determined status code for the response
  res.status(statusCode);
  
  // Send a JSON response containing the error message.
  // For production environments, sensitive stack trace details are hidden for security.
  res.json({
    message: err.message, // The error message for the client
    // Only include the stack trace in development mode for debugging purposes.
    // In production, exposing stack traces can reveal internal application structure.
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };