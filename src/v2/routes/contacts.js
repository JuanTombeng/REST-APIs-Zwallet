const express = require('express')
const route = express.Router()
const contactController = require('../controller/contacts')
const authenticator = require('../middleware/authentication')
const {hitCacheUserListByList, clearRedisUser} = require('../middleware/redis')

route.post('/add-contact-list', authenticator.userTokenVerification, clearRedisUser, contactController.addContactList)
route.get('/contact-list', authenticator.userTokenVerification, hitCacheUserListByList, contactController.getContactList)
route.get('/contact-list/member/:id', authenticator.userTokenVerification, contactController.getContactMemberDetail)
route.delete('/delete-contact-member', authenticator.userTokenVerification, contactController.deleteContactMember)

module.exports = route