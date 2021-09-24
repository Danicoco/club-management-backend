const express = require('express');
const router = express.Router();

//import other routes
const userRoute = require('./userRoute');
const clubRoute = require('./clubRoute');

router.use('/users', userRoute);
router.use('/clubs', clubRoute);

module.exports = router;