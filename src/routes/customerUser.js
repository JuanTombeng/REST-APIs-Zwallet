const express = require('express')
const route = express.Router()
const userController = require('../controllers/customerUser.js')

route.post('/signup', userController.userSignUp)
route.post('/login', userController.userLogin)
module.exports = route