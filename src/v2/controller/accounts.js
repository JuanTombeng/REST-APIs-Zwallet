const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common')
const userQuery = require('../models/users')
const accountQuery = require('../models/accounts')

const topUpAccountBalance = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const {amount, topUpMethod, pin} = req.body
        if (active === 1) {
            const [user] = await userQuery.getUserIdByToken(email, role)
            const [pinVerification] = await userQuery.getUserPin(email, user.id)
            if (pin === pinVerification.pin) {
                const [accountDetail] = await accountQuery.getAccountDetail(user.id)
                const topupData = {
                    balance : accountDetail.balance + amount,
                    income : accountDetail.income + amount
                }
                const result = await accountQuery.topUpAccountBalance(topupData, user.id)
                if (result.affectedRows > 0) {
                    const topUpId = uuidv4()
                    const topUpHistoryData = {
                        id : topUpId,
                        id_user : user.id,
                        amount : amount,
                        method : topUpMethod
                    }
                    const topUpHistory = await accountQuery.topUpHistory(topUpHistoryData)
                    const results = {
                        topUpAccount : result,
                        topUpHistory : topUpHistory
                    }
                    commonHelper.response(res, results, 200, `User ${email} is succesfully adding ${amount} to their account`)
                } else {
                    return next(createError(403, 'Top Up process is failed'))
                }
            } else {
                return next(createError(403, 'PIN is incorrect'))
            }
        }
    } catch (error) {
        console.log(error);
        next(createError(500, new createError.InternalServerError()))
    }
}


module.exports = {
    topUpAccountBalance
}