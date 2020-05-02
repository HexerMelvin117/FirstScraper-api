const bcrypt = require('bcrypt')
const dbconfig = require('./dbconfig')

const pool = dbconfig.pool

const addUser = async (email, name, hashedPassword) => {
    console.log(email, name, hashedPassword)
    await pool.query(`INSERT INTO users (user_name, user_email, user_password)
                VALUES ($1, $2, $3)`,
                [name, email, hashedPassword])
}

const checkRegistrationFields = ({email, name, password, confirmPassword}) => {
    if (!email || !password || !name || !confirmPassword) {
        return false
    }
    if (password !== confirmPassword) return false
    return true
}

const submitUserInfo = async (userInfo) => {
    const { email, name, password } = userInfo
    let hashedPassword = await bcrypt.hash(password, 10)

    await addUser(email, name, hashedPassword)
}

module.exports = {
    checkRegistrationFields,
    submitUserInfo
}