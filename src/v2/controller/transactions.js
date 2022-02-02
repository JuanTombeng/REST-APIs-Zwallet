const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const createError = require('http-errors')
const commonHelper = require('../helper/common.js')
const userQuery = require('../models/users.js')
const transactionQuery = require('../models/transactions.js')

const createTransaction = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        const {to_user_id, amount, transaction_type, notes, pin} = req.body
        if (active === 1) {
            const [userSender] = await userQuery.getUserIdByToken(email, role)
            const [userSenderPin] = await userQuery.getUserPin(email, userSender.id)
            const senderCheckBalance = await transactionQuery.checkBalance(userSender.id)
            const senderCurrentOutcome = await transactionQuery.currentOutcome(userSender.id)
            const receiverCheckBalance = await transactionQuery.checkBalance(to_user_id)
            const receiverCurrentIncome = await transactionQuery.currentIncome(to_user_id)
            const transactionId = uuidv4()
            let transactionData = {
                id : transactionId,
                from_user_id : userSender.id,
                to_user_id : to_user_id,
                amount : amount,
                transaction_type : transaction_type,
                notes : notes,
                status : 1
            }
            if (senderCheckBalance[0].balance > amount) {
                if (userSenderPin.pin === pin) {
                    const transfer = await transactionQuery.createTransaction(transactionData)
                    if (transfer.affectedRows > 0) {
                        const senderRemainingBalance = senderCheckBalance[0].balance - amount
                        const senderCurrentBalance = await transactionQuery.updateBalance(userSender.id, senderRemainingBalance)
                        const senderTotalOutcome = senderCurrentOutcome[0].outcome + amount
                        const senderOutcomeUpdate = await transactionQuery.updateOutcome(userSender.id, senderTotalOutcome)
                        const receiverAddedBalance = receiverCheckBalance[0].balance + amount
                        const receiverCurrentBalance = await transactionQuery.updateBalance(to_user_id, receiverAddedBalance)
                        const receiverTotalIncome = receiverCurrentIncome[0].income + amount
                        const receiverIncomeUpdate = await transactionQuery.updateIncome(to_user_id, receiverTotalIncome)
                        const result = {
                            senderBalance : senderCurrentBalance,
                            receiverBalance : receiverCurrentBalance,
                            transfer : transfer
                        }
                        commonHelper.response(res, result, 200, `New Transaction is created under the ID : ${transactionId}`)
                    }
                } else {
                    return next(createError(400, 'Your PIN is incorrect'))
                }
            } else if (senderCheckBalance[0].balance < amount) {
                transactionData = {
                    ...transactionData,
                    status : 0
                }
                const transfer = await transactionQuery.createTransaction(transactionData)
                commonHelper.response(res, transfer, 422, `Transaction with ID : ${transactionId} is failed due to the shortage of balance`)
            }
        } else {
            return next(createError(400, 'Your account is not yet active'))
        }
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const getTransactionsHistory = async (req, res, next) => {
    try {
        const {email, role, active} = req.decoded
        if (active === 1) {
            const [userSender] = await userQuery.getUserIdByToken(email, role)
            const result = await transactionQuery.getTransactionsHistory(userSender.id)
            commonHelper.response(res, result, 200, `Transaction History of user : ${userSender.id}.`)
        } else {
            return next(createError(400, 'Your account is not yet active'))
        }
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        const transactionId = req.params.id
        const {active, role} = req.decoded
        const {from_account_id, to_account_id, amount} = req.body
        if (active === 1 && role === 'admin') {
            const transactionData = {
                from_account_id : from_account_id,
                to_account_id : to_account_id,
                amount : amount,
                updated_at : new Date()
            }
            const result = await transactionQuery.updateTransaction(transactionId, transactionData)
            commonHelper.response(res, result, 200, `Transaction with ID : ${transactionId} is updated!`)
        } else {
            res.redirect('http://localhost:3000/login')
            return next(createError(400, 'You are not authorized to continue'))
        }
    } catch (error) {
        console.log(error)
        const err = new createError.InternalServerError()
        next(err)
    }
}

module.exports = {
    createTransaction,
    getTransactionsHistory,
    updateTransaction
}