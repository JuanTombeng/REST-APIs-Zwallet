const userQuery = require('../models/users.js')

const getUsers = async (req, res, next) => {
    try {
        const result = await userQuery.getAllUsers()
        res.json({
            results: result
        })
    } catch (error) {
        new Error(error)
    }
}

const createUser = async (req, res, next) => {
    try {
        const {username, email, password} = req.body
        const data = {
            username : username,
            email : email,
            password : password
        }
        const result = await userQuery.createNewUser(data)
        res.json({
            results: result
        })
    } catch (error) {
        new Error(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const {username, email, password} = req.body
        const data = {
            username : username,
            email : email,
            password : password
        }
        const result = await userQuery.updateUser(data, userId)
        res.json({
            results: result
        })
    } catch (error) {
        new Error(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const result = await userQuery.deleteUser(userId)
        res.json({
            results: result
        })
    } catch (error) {
        new Error(error)
    }
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}