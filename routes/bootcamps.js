const express = require('express');
const router = express.Router()

const {createBootcamp,deleteBootcamp,getBootcamp,updateBootcamp, getBootcamps, getBootcampsInRadius} = require('../controllers/bootcamps')




router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).delete(deleteBootcamp).put(updateBootcamp)

router.get('/radius/:distance/:zipcode', getBootcampsInRadius)
module.exports = router