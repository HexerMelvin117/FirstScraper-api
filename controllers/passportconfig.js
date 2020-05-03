const { pool } = require('./dbconfig')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')
const { searchUser } = require('./login-funcs')

function initialize(passport) {
    const authUser = async (userEmail, userPassword, done) => {
        try {
            const userInfo = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [userEmail])
            if (userInfo.rows.length > 0) {
                const returnedUser = userInfo.rows[0]
                bcrypt.compare(userPassword, returnedUser.password, (err, isMatch) => {
                    if (error) {
                        throw error
                    }
                    if (isMatch) {
                        return done(null, returnedUser)
                    } else {
                        return done(null, false, { message: "Incorrect password" })
                    }
                })
            } else {
                return done(null, false, { message: "Invalid credentials" })
            }
        } catch (error) {
            throw error
        }
    }

    passport.use(
        new LocalStrategy(
            {
                emailField: "email",
                passwordField: "password"
            },
            authUser
        )
    )

    passport.serializeUser(async (user, done) => done(null, user.id))
    passport.deserializeUser((userId, done) => {
        try {
            const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [userId])
            return done(null, result.rows[0].user_id)
        } catch (error) {
            throw done(error)
        }
    })
}

