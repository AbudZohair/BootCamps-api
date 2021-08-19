const ErrorResponse = require("../utils/erorrResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err);

  // Handle Mongoose Bad ObjectId
  if (err.name === "CastError") {
    error = new ErrorResponse(
      `Resource not found with value of ${err.value}`,
      404
    );
  }

  // Handle Mongoose Duplicate Key
  if (err.code === 11000) {
    error = new ErrorResponse(`Duplicate Field value Entered`, 400);
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((error) => error.message);
    error = new ErrorResponse(message, 400);
  }

  // Log to console for dev
  console.log(err.stack.red);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
