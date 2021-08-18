const express = require('express');
const router = express.Router()

const {createBootcamp,deleteBootcamp,getBootcamp,updateBootcamp, getBootcamps, } = require('../controllers/bootcamps')




router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).delete(deleteBootcamp).put(updateBootcamp)

module.exports = router