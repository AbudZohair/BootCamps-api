const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/erorrResponse");
const Course = require("../models/Course");



// @desc            Get All Courses or Courses for a specific bootcamp
// @route           GET /api/v1/courses
// @route           GET /api/v1/bootcamps/:bootcampId/courses
// @access          Public

module.exports.getCourses = asyncHandler(async (req, res, next) => { 
    let query; 

    if(req.params.bootcampId){ 
        query = Course.find({bootcamp: req.params.bootcampId})
    }else{
        query = Course.find().populate({path: 'bootcamp', select: 'name description'})
    }

    const courses = await query

    res.status(200).json({
        success: true, 
        count: courses.length, 
        data: courses
    })
}) 


// @desc            GET Single Course
// @route           GET /api/v1/courses/:id
// @access          Public

module.exports.getCourse = asyncHandler(async (req, res, next) => { 
    const course = await Course.findById(req.params.id).populate({ 
        path: 'bootcamp',
        select: 'name description'
    })

    if(!course){ 
        return next(new ErrorResponse(`No Course Found With id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true, 
        data: course
    })
})