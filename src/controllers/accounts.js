const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const accountQuery = require('../models/accounts.js')


const getAccounts = async (req, res, next) => {
    try {
        const order = req.query.order || 'created_at'
        const sort = req.query.sort || 'desc'
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const offset = (page - 1) * limit
        const result = await accountQuery.getAccounts({
            order : order,
            sort : sort,
            offset : offset,
            limit : limit
        })
        const resultCount = await accountQuery.countAccounts()
        const {total} = resultCount[0]
        commonHelper.response(res, result, 200, `List of all accounts`, null, {
            curretPage : page,
            limit : limit,
            totalData : total,
            totalPage : Math.ceil(total / limit)
        })
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const updateAccount = async (req, res, next) => {
    try {
        const userId = req.params.id
        const {balance} = req.body
        const accountData = {
            balance : balance,
            updated_at : new Date()
        }
        const result = await accountQuery.updateAccount(userId, accountData)
        commonHelper.response(res, result, 200, `Account with ID:${userId} is updated!`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const getAccountDetails = async (req, res, next) => {
    try {
        const accountId = req.params.id
        const result = await accountQuery.getAccountDetails(accountId)
        commonHelper.response(res, result, 200, `Account details : ${accountId}`, null)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

module.exports = {
    getAccounts,
    updateAccount,
    getAccountDetails
}