const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const accountQuery = require('../models/accounts.js')


const getAccounts = async (req, res, next) => {
    try {
        const order = req.query.order || 'created_at'
        const sort = req.query.sort || 'desc'
        const result = await accountQuery.getAccounts({
            order : order,
            sort : sort
        })
        commonHelper.response(res, result, 200)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const updateAccount = async (req, res, next) => {
    try {
        const accountId = req.params.id
        const {account_number, balance} = req.body
        const accountData = {
            account_number : account_number,
            balance : balance,
            updated_at : new Date()
        }
        const result = await accountQuery.updateAccount(accountId, accountData)
        commonHelper.response(res, result, 200, `Account with ID:${accountId} is updated!`)
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

module.exports = {
    getAccounts,
    updateAccount
}