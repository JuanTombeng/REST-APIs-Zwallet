const express = require('express')
const route = express.Router()
const contactController = require('../controller/contacts')
const validator = require('../middleware/validation')
const authenticator = require('../middleware/authentication')
const {hitCacheUserEmail, hitCacheUserListByList, clearRedisUser} = require('../middleware/redis')

route.post('/add-contact-list', authenticator.userTokenVerification, clearRedisUser, contactController.addContactList)
route.get('/contact-list', authenticator.userTokenVerification, hitCacheUserListByList, contactController.getContactList)

module.exports = route