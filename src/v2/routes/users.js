const express = require('express')
const route = express.Router()
const userController = require('../controller/users')
const validator = require('../middleware/validation')
const authenticator = require('../middleware/authentication')

route.post('/signup', validator.userInputValidation, userController.signup)
route.post('/login', userController.login)
route.get('/email-verification/:token', authenticator.emailTokenVerification)

module.exports = route