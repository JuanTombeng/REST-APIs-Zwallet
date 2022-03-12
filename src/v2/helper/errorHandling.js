const {response} = require('./common')

const errorHandling = (err, req, res, next) => {
    const statusCode = err.status
    const message = err.message
    response(res, null, statusCode, message)
}

module.exports = {
    errorHandling
}