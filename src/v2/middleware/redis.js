// const client = require('../config/redis')
// const commonHelper = require('../helper/common')

// const hitCacheUserEmail = async (req, res, next) => {
//     const {email, role, active} = req.decoded
//     const user = await client.get(`user/:${email}`)
//     if (user !== null) {
//         commonHelper.response(res, JSON.parse(user), 200, `User ${email} fetched from Redis Server`)
//     } else {
//         next()
//     }
// }

// const hitCacheUserListByList = async (req, res, next) => {
//     const {email, role, active} = req.decoded
//     const contactList = await client.get(`contact-list/:${email}`)
//     if (contactList !== null) {
//         commonHelper.response(res, JSON.parse(contactList), 200, `User ${email} Contact List is fetched from Redis Server`)
//     } else {
//         next()
//     }
// }

// const clearRedisUser = (req, res, next) => {
//     client.del('user')
//     client.del('contact-list')
//     next()
// }

// module.exports = {
//     hitCacheUserEmail,
//     hitCacheUserListByList,
//     clearRedisUser
// }