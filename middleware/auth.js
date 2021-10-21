const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/erorrResponse");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // Check it the token in authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else check if the token in cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not Authoirzed to access this route", 401));
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // sign the logged in user to the request
    req.user = User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not Authoirzed ", 401));
  }
});
