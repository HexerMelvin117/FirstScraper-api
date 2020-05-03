const bcrypt = require('bcrypt')
const dbconfig = require('./dbconfig')

const pool = dbconfig.pool

// Check if email has already been used
const checkEmail = async ({email}) => {
    const response = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [email])
    if (response.rows.length > 0) return true
    return false
}

// Adds user to the database
const addUser = async (email, name, hashedPassword) => {
    await pool.query(`INSERT INTO users (user_name, user_email, user_password)
                VALUES ($1, $2, $3)`,
                [name, email, hashedPassword])
}

// Checks that all fields have been filled
const checkRegistrationFields = ({email, name, password, confirmPassword}) => {
    if (!email || !password || !name || !confirmPassword) {
        return false
    }
    if (password !== confirmPassword) return false
    return true
}

// Submits to database
const submitUserInfo = async (userInfo) => {
    const { email, name, password } = userInfo
    let hashedPassword = await bcrypt.hash(password, 10)

    await addUser(email, name, hashedPassword)
}

module.exports = {
    checkRegistrationFields,
    checkEmail,
    submitUserInfo
}