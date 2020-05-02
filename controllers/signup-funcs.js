const bcrypt = require('bcrypt')
const dbconfig = require('./dbconfig')

const pool = dbconfig.pool

const addUser = (email, name, hashedPassword) => {
    pool.query(`INSERT INTO users (user_name, user_email, user_password)
                VALUES ($1, $2, $3) RETURING user_id, user_password`,
                [name, email, hashedPassword])
}

const checkRegistrationFields = ({email, name, password, confirmPassword}) => {
    if (!email || !password || !name || !confirmPassword
            && password !== confirmPassword) {
        return false
    }
    return true
}

const submitUserInfo = (userInfo) => {
    const { email, name, password } = userInfo
    let hashedPassword = bcrypt.hash(password, 10)

    addUser(email, name, hashedPassword)
}

module.exports = {
    checkRegistrationFields,
    submitUserInfo
}