const { pool } = require('./dbconfig')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

function initialize(passport) {
    passport.use('local', new LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {
        loginAttempt()
        async function loginAttempt() {
            try {
                const userInfo = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [username])
                
                if (userInfo.rows.length > 0) {
                    const returnedUser = userInfo.rows[0]
                    bcrypt.compare(password, returnedUser.user_password, (error, isMatch) => {
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
        
    }))

    passport.serializeUser((user, done) => {
        done(null, user.user_id)
    })
    passport.deserializeUser((id, done) => {
        UserDeserialize()
        async function UserDeserialize() {
            try {
                const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [id])
                done(null, result.rows[0])
            } catch (error) {
                throw done(error)
            }
        }
    })
}

module.exports = {
    initialize
}

