const express = require('express');
const route = express.Router()
const usersController = require('../controllers/users.js')
const validator = require('../middleware/common')

route.get('/', validator.userVerification, usersController.getUsers)
route.get('/:id', validator.userVerification, usersController.getUserDetails)
route.post('/signup', validator.userInputValidation, usersController.signup)
route.post('/login', usersController.login)
route.put('/update/:id', validator.userVerification, validator.userInputValidation, usersController.updateUser)
route.delete('/delete/:id', validator.userVerification, usersController.deleteUser)
route.get('/email-verification/:id', validator.emailTokenVerification)

module.exports = route