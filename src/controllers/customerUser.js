const bcrypt = require('bcrypt')
const userQuery = require('../models/customerUser.js')

const userSignUp = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt()
        const {username, email, password} = req.body
        const hashedPassword = await bcrypt.hash(password, salt)
        const data = {
            username : username,
            email : email,
            password : hashedPassword
        }
        const result = await userQuery.userSignUp(data)
        res.json({
            results: result
        })
    } catch (error) {
        new Error(error)
    }
}

const userLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const data = {
            email : email,
            password : password
        }
        const findUser = await userQuery.userLogin(data)
        const checkPassword = await bcrypt.compare(password, findUser[0].password)
        if (checkPassword) {
            res.json({
                message: `Login is Successful! Welcome back ${findUser[0].username}`
            })
        } else {
            res.json({
                message: `Sorry, your username or password is wrong! Please try again.`
            })
        }
    } catch (error) {
        res.json({
            message : `Sorry, your username or password is wrong! Please try again.`
        })
    }
}

module.exports = {
    userSignUp,
    userLogin
}