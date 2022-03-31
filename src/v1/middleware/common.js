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

const userVerification = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            return next(createError(403, 'Server Need Token'))
        }
        const verifyOptions = {
            issuer : `zwallet`
        }
        const secretKey = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secretKey, verifyOptions)
        req.email = decoded.email
        next()
    } catch (error) {
        if (error && error.name === `JsonWebTokenError`) {
            return next(createError(400, 'Token Invalid'))
        } else if (error && error.name === 'TokenExpiredError') {
            return next(createError(400, 'Token Expired'))
        } else {
            return next(createError(400, 'Token not activated'))
        }
    }
}

const emailTokenVerification = async (req, res, next) => {
    try {
        const receivedToken = req.params.id
        const secretKey = process.env.SECRET_KEY
        const confirmEmail = jwt.verify(receivedToken, secretKey)
        const username = confirmEmail.username
        const email = confirmEmail.email
        const result = await userQuery.updateVerifiedUser(username, email)
        console.log(`update user : ${result}`)
        res.redirect('https://zwallet-app.vercel.app/auth/login')
        commonHelper.response(res, result, 200, `User with username ${username} is verified`)
    } catch (error) {
        if (error && error.name === 'JsonWebTokenError') { return next(createError(400, 'Token Invalid')); } else if (error && error.name === 'TokenExpiredError') { return next(createError(400, 'Token Expired')); } else {
            console.log(error)
            return next(createError(400, error));
        }
    }
}


module.exports = {
    userInputValidation,
    transactionInputValidation,
    userVerification,
    emailTokenVerification
}
