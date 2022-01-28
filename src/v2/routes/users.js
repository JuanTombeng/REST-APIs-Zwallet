const express = require('express')
const route = express.Router()
const userController = require('../controller/users')
const validator = require('../middleware/validation')
const authenticator = require('../middleware/authentication')
const {upload} = require('../middleware/uploader')
const {hitCacheUserEmail, clearRedisUser} = require('../middleware/redis')

route.post('/signup', validator.userInputValidation, clearRedisUser, userController.signup)
route.post('/login', clearRedisUser, userController.login)
route.post('/profile-picture', authenticator.userTokenVerification, upload.single('profile_picture'), clearRedisUser, userController.uploadProfilePicture)
route.get('/email-verification/:token', authenticator.emailTokenVerification)
route.get('/:email', authenticator.userTokenVerification, hitCacheUserEmail, userController.getUserDetails)

module.exports = route