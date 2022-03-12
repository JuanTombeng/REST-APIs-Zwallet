const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common')
const userQuery = require('../models/users')
const contactQuery = require('../models/contacts')
// const client = require('../config/redis')

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
                const createContactGroup = await contactQuery.addContactGroup(contactGroupData)
                const addContactMember = await contactQuery.addContactMember(contactMemberData)
                const results = {
                    addContactMember,
                    createContactGroup
                }
                commonHelper.response(res, results, 200, `Group id: ${contact_group_id} is created and userId : {contactMemberId[0].id} is added`, null)
            } else if (checkContactGroup.length !== 0) {
                const contact_group_id = checkContactGroup[0].id
                const checkIfMemberAlreadyAdded = await contactQuery.getContactMemberExisted(contactMemberId[0].id, contact_group_id)
                if (checkIfMemberAlreadyAdded.length > 0) {
                    commonHelper.response(res, `The member with ${phone_number} number is already added. Please select a different phone number to add`)
                }
                const contactMemberData = {
                    id : uuidv4(),
                    contact_groups_id : contact_group_id,
                    id_user : contactMemberId[0].id
                }
                const addContactMember = await contactQuery.addContactMember(contactMemberData)
                if (addContactMember.affectedRows > 0) {
                    const totalMember = checkContactGroup[0].total_member + 1
                    const updateContactGroup = await contactQuery.updateContactGroupTotal(totalMember, contact_group_id)
                    const results = {
                        addContactMember,
                        updateContactGroup
                    }
                    commonHelper.response(res, results, 200, `UserId : ${contactMemberId[0].id} is added to contact group ${contact_group_id}`, null)
                }
            }
        } else {
            return next(createError(400, 'Your account is not yet active'))
        }
    } catch (error) {
        console.log(error.message);
        next({ status: 500, message: `${error.message}` });
    }
}

const getContactList = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const search = req.query.name
        const sort = req.query.sort || 'desc'
        const order = req.query.order || 'created_at'
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const offset = (page - 1) * limit
        if (active === 1) {
            const [userHolderId] = await userQuery.getUserIdByToken(email, role)
            const contactGroupList = await contactQuery.getContactGroup({
                id : userHolderId.id,
                search : search,
                sort : sort,
                order : order,
                offset : offset,
                limit : limit
            })
            const memberCount = await contactQuery.getContactGroupIdAndTotal(userHolderId.id)
            console.log(memberCount)
            if (memberCount.length > 0) {
                const total_member = memberCount[0].total_member
                // await client.setEx(`contact-list/${email}`, 60 * 60, JSON.stringify(contactGroupList))
                commonHelper.response(res, contactGroupList, 200, `Contact List of user : ${userHolderId.id}`, null, {
                    currentPage : page,
                    limit : limit,
                    totalData : total_member,
                    totalPage : Math.ceil(total_member / limit)
                })
            } else {
                next({ status: 200, message: `You have 0 contact member, please add a contact member first.` });
            }
        } else {
            return next(createError(400, 'Your account is not yet active'))
        }
    } catch (error) {
        console.log(error.message);
        next({ status: 500, message: `${error.message}` });
    }
}

const getContactMemberDetail = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const userTargetID = req.params.id
        if (active === 1) {
            const [user] = await userQuery.getUserIdByToken(email, role)
            const contactMemberDetail = await contactQuery.getContactMemberDetail(userTargetID, user.id)
            // await client.setEx(`contact-member-detail/${userTargetID}`, 60 * 60, JSON.stringify(contactMemberDetail))
            commonHelper.response(res, contactMemberDetail, 200, `Contact member ${userTargetID} of group ${user.id} detail:`, null)
        } else {
            return next(createError(400, 'Your account is not yet active'))
        }
    } catch (error) {
        console.log(error.message);
        next({ status: 500, message: `${error.message}` });
    }
}

const deleteContactMember = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const {id} = req.body
        if (active === 1) {
            const [user] = await userQuery.getUserIdByToken(email, role)
            const [contactGroup] = await contactQuery.getContactGroupIdAndTotal(user.id)
            const [userTarget] = await contactQuery.getContactMemberDetail(id, user.id)
            const result =  await contactQuery.deleteContactMember(contactGroup.id, id)
            const remainingMembers = contactGroup.total_member - 1
            await contactQuery.updateContactGroupTotal(remainingMembers, contactGroup.id)
            commonHelper.response(res, result, 200, `contact member ${userTarget.first_name} ${userTarget.last_name} is deleted`, null)
        } else {
            return next(createError(500, 'Your account is not yet active'))
        }
    } catch (error) {
        console.log(error.message);
        next({ status: 500, message: `${error.message}` });
    }
}

module.exports = {
    addContactList,
    getContactList,
    getContactMemberDetail,
    deleteContactMember
}