const bcrypt = require('bcrypt')
const { pool } = require('./dbconfig')

const searchUser = async ({email}) => {
    const result = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [email])
    return result.rows
}

module.exports = {
    searchUser
}