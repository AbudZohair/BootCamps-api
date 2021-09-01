const express = require('express');
const router = express.Router()

const {createBootcamp,deleteBootcamp,getBootcamp,updateBootcamp, getBootcamps, getBootcampsInRadius} = require('../controllers/bootcamps');
const coursesRouter = require('./courses');


// Nested Routes (Re-Route)
router.use('/:bootcampId/courses', coursesRouter)

router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).delete(deleteBootcamp).put(updateBootcamp)

router.get('/radius/:distance/:zipcode', getBootcampsInRadius)
module.exports = router