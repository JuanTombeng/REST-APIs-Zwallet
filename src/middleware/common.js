const Joi = require('joi')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const userQuery = require('../models/users')
const commonHelper = require('../helper/common')

// validation for sign up and update user
const userInputValidation = (req, res, next) => {
    const {username, email, password, pin} = req.body
    const convertedPin = pin.toString()
    const validateData = Joi.object({
        username : Joi.string().alphanum().min(5).max(30).required(),
        email : Joi.string().email().lowercase().required(),
        password : Joi.string().min(8).max(16).alphanum().required(),
        pin : Joi.string().length(6).required(),
    })
    const {error} = validateData.validate({
        username : username,
        email : email,
        password : password,
        pin : convertedPin
    })
    if (error) {
        const errorMessage = error.details[0].message
        return next(createError(422, errorMessage))
    } else {
        next()
    }
}

// validation for create transaction
const transactionInputValidation = (req, res, next) => {
    const {from_user_id, to_user_id, amount, transaction_type, notes, status} = req.body
    const validateData = Joi.object({
        from_user_id : Joi.string().required(),
        to_user_id : Joi.string().required(),
        amount : Joi.number().required(),
        transaction_type : Joi.string().required(),
        notes : Joi.string().required(),
    })
    const { error } = validateData.validate({
        from_user_id : from_user_id,
        to_user_id : to_user_id,
        amount : amount,
        transaction_type : transaction_type,
        notes : notes,
    })
    if (error) {
        const errorMessage = error.details[0].message
        return next(createError(422, errorMessage))
    } else {
        next()
    }
}

const emailTokenVerification = async (req, res, next) => {
    try {
        const receivedToken = req.params.token
        const secretKey = process.env.SECRET_KEY
        const confirmEmail = jwt.verify(receivedToken, secretKey)
        req.username = confirmEmail.username,
        req.email = confirmEmail.email
        const updateUserStatus = await userQuery.updateVerifiedUser(req.username, req.email)
        commonHelper.response(res, updateUserStatus, 200, `User with username ${req.username} is verified`, null)
        res.redirect('http://localhost:3000/login')
    } catch (error) {
        if (err && err.name === 'JsonWebTokenError') { return next(createError(400, 'Token Invalid')); } else if (err && err.name === 'TokenExpiredError') { return next(createError(400, 'Token Expired')); } else {
            return next(createError(400, 'Token not actived'));
        }
    }
}


module.exports = {
    userInputValidation,
    transactionInputValidation,
    emailTokenVerification
}
