const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const userQuery = require('../models/customerUser.js')

const userSignUp = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt()
        const {username, email, password} = req.body
        const userId = uuidv4()
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            id : userId,
            username : username,
            email : email,
            password : hashedPassword
        }
        const accountData = {
            id : uuidv4(),
            id_user : userId,
            account_number : Math.floor(Math.random() * (11000 - 10000)) + 10000
        }
        // const contactData = {
        //     id : 3,
        //     id_user_holder : userId
        // }
        const result = await userQuery.userSignUp(userData)
        const account = await userQuery.userAccountCreation(accountData)
        // const contact = await userQuery.userContactHolder(contactData)
        res.json({
            results: result,
            accounts: account,
            // contact : contact
        })
    } catch (error) {
        res.json({
            errorMessage : error
        })
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