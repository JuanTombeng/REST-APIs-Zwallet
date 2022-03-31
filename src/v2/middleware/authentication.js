const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const userQuery = require('../models/users')
const commonHelper = require('../helper/common')

const isAdmin = async (req, res, next) => {
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
        console.log(decoded.role)
        if (decoded.role !== 'admin') {
            next(createError(400, 'You are not authorized to continue'))
        } else {
            req.decoded = decoded
            next()
        }
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
        res.redirect('https://zwallet-app.vercel.app/auth/login')
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

module.exports = {
    isAdmin,
    userTokenVerification,
    emailTokenVerification,
    resetPasswordEmailTokenVerification
}