const Joi = require('joi')
const createError = require('http-errors')

const insertValidation = (req, res, next) => {
    const {username, email, password} = req.body
    const validation = Joi.object({
        username : Joi.string().alphanum().min(5).max(30).required(),
        email : Joi.string().email().lowercase().required(),
        password : Joi.string().min(8).max(16).uppercase(1).alphanum().required(),
    }).options({ abortEarly: false })
    const {error} = validation.validate(req.body)
    if (error) {
        const errorMessage = error.details.map((errObject) => errObject.message).toString();
        return next(createError(422, errorMessage));
    } else {
        next()
    }
}

module.exports = {
    insertValidation
}
