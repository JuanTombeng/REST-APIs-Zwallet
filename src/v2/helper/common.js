const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const handleURLNotFound = (req, res, next) => {
    res.status(404)
    res.json({
        message : `URL NOT FOUND`
    })
}

const response = (res, result, status, message, error, pagination) => {
    res.status(status).json({
        status : `Success!`,
        code : status || 200,
        data : result,
        message : message || null,
        error : error || null,
        pagination : pagination
    })
}

const generateToken = (payload) => {
    const secretKey = process.env.SECRET_KEY
    const verifyOptions = {
        expiresIn : 60 * 60,
        issuer : 'zwallet'
    }
    const result = jwt.sign(payload, secretKey, verifyOptions)
    return result
}

const sendEmailVerification = async (emailTarget, token) => {
    const transporter = nodemailer.createTransport({
        host : `smtp.gmail.com`,
        port : 465,
        secure : true,
        auth : {
            user : process.env.ADMIN_EMAIL_ACCOUNT,
            pass : process.env.ADMIN_EMAIL_PASSWORD
        }
    })
    const info = await transporter.sendMail({
        from : `mail.zwallet@gmail.com`,
        to : emailTarget,
        subject : `Zwallet User Registration Verification`,
        html : 
            `
            
            `
    })
    console.log(info)
}


module.exports = {
    handleURLNotFound,
    response,
    generateToken,
    sendEmailVerification
}