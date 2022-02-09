const client = require('../config/redis')
const commonHelper = require('../helper/common')

const hitCacheUserEmail = async (req, res, next) => {
    const {email, role, active} = req.decoded
    const user = await client.get(`user/:${email}`)
    if (user !== null) {
        commonHelper.response(res, JSON.parse(user), 200, `User ${email} fetched from Redis Server`)
    } else {
        next()
    }
}

const hitCacheUserListByList = async (req, res, next) => {
    const {email, role, active} = req.decoded
    const contactList = await client.get(`contact-list/${email}`)
    if (contactList !== null) {
        commonHelper.response(res, JSON.parse(contactList), 200, `User ${email} Contact List is fetched from Redis Server`)
    } else {
        next()
    }
}

const clearRedisUser = (req, res, next) => {
    const {email, role, active} = req.decoded
    client.del(`user/${email}`)
    next()
}

const clearRedisContactList = (req, res, next) => {
    const {email, role, active} = req.decoded
    client.del(`contact-list/${email}`)
    next()
}

const clearRedisContactMemberDetail = (req, res, next) => {
    const userTargetID = req.params.id
    client.del(`contact-list/${userTargetID}`)
    next()
}

module.exports = {
    hitCacheUserEmail,
    hitCacheUserListByList,
    clearRedisUser,
    clearRedisContactList,
    clearRedisContactMemberDetail
}