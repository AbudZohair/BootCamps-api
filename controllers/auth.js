const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/erorrResponse");
const User = require("../models/User");

// @desc      regisetr new user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, role, name } = req.body;

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Get token for Created User
  const token = user.getSignedJwtToken();
  res.json({ success: true, token });
});

// @desc      Login User
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("please provide email and password", 400));
  }

  // Check if entered Email Exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // Get token for loggedin user
  const token = user.getSignedJwtToken();
  res.json({ success: true, token });
});
