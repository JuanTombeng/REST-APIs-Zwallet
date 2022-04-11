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
                    const topUpHistory = await accountQuery.addTopUpHistory(topUpHistoryData)
                    const results = {
                        topUpAccount : result,
                        topUpHistory : topUpHistory
                    }
                    commonHelper.response(res, results, 200, `User ${email} is succesfully adding ${amount} to their account`)
                }
            } else {
                next({ status: 400, message: `Sorry, Your current PIN is incorrect.`})
            }
        } else {
            next({ status: 403, message: `Sorry, your account is not yet activated.`})
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const getTopUpHistory = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        if (active === 1) {
            const [user] = await userQuery.getUserIdByToken(email, role)
            const result = await accountQuery.getTopUpHistory(user.id)
            console.log(typeof result[0].updated_at)
            commonHelper.response(res, result, 200, `User ${email} top up history`, null)
        }
    } catch (error) {
        
    }
}


module.exports = {
    topUpAccountBalance,
    getTopUpHistory
}