const connection = require('../config/dbConfig')

const signup = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO users SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const findUserEmail = (username, email) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT email from users WHERE username = ? AND email = ?`
        connection.query(sql, [username, email], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateVerifiedUser = (username, email) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE users SET active = 1 WHERE username = ? AND email = ?`
        connection.query(sql, [username, email], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const login = (data) => {
    return new Promise ((resolve, reject) => {
        const findUserQuery = `SELECT email, password, active, role FROM users WHERE email = ?`
        connection.query(findUserQuery, data.email, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const findUserEmailLogin = (email) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT email from users WHERE email = ?`
        connection.query(sql, email, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getUserDetails = (email, role) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT users.id, users.email, users.first_name, users.last_name, users.pin,
        users.phone_number, users.role, users.active, users.profile_picture, accounts.id AS id_accounts, 
        accounts.balance, accounts.income, accounts.outcome FROM users 
        INNER JOIN accounts ON users.id = accounts.id_user WHERE users.email = ? AND users.role = ?`
        connection.query(sql, [email, role], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const uploadUserProfilePicture = (email, role, profile_picture) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE users SET profile_picture = ? WHERE email = ? AND role = ?`
        connection.query(sql, [profile_picture, email, role], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getUserIdByToken = (email, role) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT id FROM users WHERE email = ? AND role = ?`
        connection.query(sql, [email, role], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getUserIdByPhoneNumber = (phone_number) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT id, first_name, last_name, profile_picuture FROM users WHERE phone_number = ?`
        connection.query(sql, phone_number, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}



module.exports = {
    signup,
    findUserEmail,
    updateVerifiedUser,
    login,
    findUserEmailLogin,
    getUserDetails,
    uploadUserProfilePicture,
    getUserIdByToken,
    getUserIdByPhoneNumber
}