const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common')
const userQuery = require('../models/users')
const contactQuery = require('../models/contacts')
const client = require('../config/redis')

const addContactList = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const {phone_number} = req.body
        if (active === 1) {
            const userHolderId = await userQuery.getUserIdByToken(email, role)
            const contactMemberId = await userQuery.getUserIdByPhoneNumber(phone_number)
            if (contactMemberId.length === 0) {
                return next(createError(500, `User with phone_number : ${phone_number} is not exists`))
            }
            const checkContactGroup = await contactQuery.findContactGroup(userHolderId[0].id)
            if (checkContactGroup.length === 0) {
                const contact_group_id = uuidv4()
                const contactMemberData = {
                    id : uuidv4(),
                    contact_groups_id : contact_group_id,
                    id_user : contactMemberId[0].id
                }
                const contactGroupData = {
                    id : contact_group_id,
                    user_holder_id : userHolderId[0].id,
                    total_member : 1
                }
                const addContactMember = await contactQuery.addContactMember(contactMemberData)
                const createContactGroup = await contactQuery.addContactGroup(contactGroupData)
                const results = {
                    addContactMember,
                    createContactGroup
                }
                commonHelper.response(res, results, 200, `Group id: ${contact_group_id} is created and userId : {contactMemberId[0].id} is added`, null)
            } else if (checkContactGroup.length !== 0) {
                const contact_group_id = checkContactGroup[0].id
                const totalMember = checkContactGroup[0].total_member + 1
                const contactMemberData = {
                    id : uuidv4(),
                    contact_groups_id : contact_group_id,
                    id_user : contactMemberId[0].id
                }
                const addContactMember = await contactQuery.addContactMember(contactMemberData)
                const updateContactGroup = await contactQuery.updateContactGroupTotal(totalMember, contact_group_id)
                const results = {
                    addContactMember,
                    updateContactGroup
                }
                commonHelper.response(res, results, 200, `UserId : ${contactMemberId[0].id} is added to contact group ${contact_group_id}`, null)
            }
        } else {
            return next(createError(400, 'Your account is not yet active'))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, new createError.InternalServerError()))
    }
}

const getContactList = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        if (active === 1) {
            const [userHolderId] = await userQuery.getUserIdByToken(email, role)
            const contactGroupList = await contactQuery.getContactGroup(userHolderId.id)
            await client.setEx(`contact-list/:${email}`, 60 * 60, JSON.stringify(contactGroupList))
            commonHelper.response(res, contactGroupList, 200, `Contact List of user : ${userHolderId.id}`)
        } else {
            return next(createError(400, 'Your account is not yet active'))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, new createError.InternalServerError()))
    }
}

module.exports = {
    addContactList,
    getContactList
}