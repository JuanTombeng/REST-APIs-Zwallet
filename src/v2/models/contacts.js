const connection = require('../config/dbConfig')

const addContactMember = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO contact_members SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const addContactGroup = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO contact_groups SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const findContactGroup = (userId) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT id, total_member FROM contact_groups WHERE user_holder_id = ?`
        connection.query(sql, userId, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateContactGroupTotal = (totalMember, groupId) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE contact_groups SET total_member = ? WHERE id = ?`
        connection.query(sql, [totalMember, groupId], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getContactGroup = (userHolderId) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT contact_members.id_user, contact_groups.id, contact_groups.user_holder_id, 
        contact_groups.total_member, users.first_name, users.last_name, users.phone_number, users.profile_picture, 
        from contact_members INNER JOIN contact_groups ON contact_members.contact_groups_id = contact_groups.id 
        INNER JOIN users ON contact_members.id_user = users.id WHERE contact_groups.user_holder_id = ?`
        connection.query(sql, userHolderId, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

module.exports = {
    addContactMember,
    addContactGroup,
    findContactGroup,
    updateContactGroupTotal,
    getContactGroup
}