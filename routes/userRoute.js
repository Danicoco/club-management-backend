const express = require('express');
const { createUser, login } = require('../controller/userController');
const { validateUser } = require('../validations');
const userRoute = express.Router();

//define user routes
userRoute.post('/', validateUser, createUser);
userRoute.post('/login', login);

module.exports = userRoute;