const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/erorrResponse");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // Copy request Query
  const reqQuery = { ...req.query };

  // Fields to Execlude
  const removeFields = ["select", "sort", "page", "limit"];

  // Remove Fields from the reqQuery
  removeFields.forEach((field) => delete reqQuery[field]);

  // Add $ before gt gte lt lte in
  const queryStr = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Bootcamp.find(JSON.parse(queryStr));

  // Add Select Fields to the Query
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // Find Total Records of the Query
  const total = await Bootcamp.countDocuments(JSON.parse(queryStr))

  // Add pagination to the Query
  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;
  const pagination = {};

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  res.json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runvalidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    succesS: true,
    data: {},
  });
});

// @desc      Get Bootcamps within radius
// @route     GET /api/vi/bootcaps/radius/:distance/:zipcode
// @access    Public

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get lng, lat from geocoder
  const [loc] = await geocoder.geocode(zipcode);
  const { latitude: lat, longitude: lng } = loc;
  // Calc radius using radians
  // by dividing the distance by radius of Earth
  // Earth Radius  = 3963 miles OR 6378 km
  // We will use miles

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
