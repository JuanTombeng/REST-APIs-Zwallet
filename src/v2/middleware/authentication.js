const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const userQuery = require('../models/users')
const commonHelper = require('../helper/common')

const userTokenVerification = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            return next(createError(403, 'Server Need Token'))
        }
        const verifyOptions = {
            issuer : 'zwallet'
        }
        const secretKey = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secretKey, verifyOptions)
        req.decoded = decoded
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
        const emailToken = req.params.token
        const secretKey = process.env.SECRET_KEY
        const verifyOptions = {
            issuer : 'zwallet'
        }
        const decoded = jwt.verify(emailToken, secretKey, verifyOptions)
        const username = decoded.username
        const email = decoded.email
        const activateUser = await userQuery.updateVerifiedUser(username, email)
        res.redirect('http://localhost:3000/login')
        commonHelper.response(res, activateUser, 200, `User with username ${username} is verified`, null)
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

const resetPasswordEmailTokenVerification = async (req, res, next) => {
    try {
        const emailToken = req.params.token
        const secretKey = process.env.SECRET_KEY
        const verifyOptions = {
            issuer : 'zwallet'
        }
        const decoded = jwt.verify(emailToken, secretKey, verifyOptions)
        req.decoded = decoded
        next()
        res.redirect('http://localhost:3000/reset-password-form')
    } catch (error) {
        
    }
}

module.exports = {
    userTokenVerification,
    emailTokenVerification,
    resetPasswordEmailTokenVerification
}