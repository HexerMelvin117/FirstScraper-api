const app = module.exports = require('express')()
const signupFuncs = require('../controllers/signup-funcs')
const loginFuncs = require('../controllers/login-funcs')

app.post('/signup', async (req, res) => {
    try {
        user = req.body
        let validUser = signupFuncs.checkRegistrationFields(user)
        let repeatedEmail = await signupFuncs.checkEmail(user)

        if (validUser === true && repeatedEmail === false) {
            await signupFuncs.submitUserInfo(user)
            res.json({message: "user succesfully created"})
        }

        // Error management
        if (repeatedEmail === true) {
            res.json({message: "email already in use"})
        } else {
            res.json({message: "User could not be created"})
        }
    } catch (error) {
        res.json({message: error})
    }
})

app.post('/login', async (req, res) => {
    try {
        let user = req.body
        const response = await loginFuncs.searchUser(user)
        res.json(response)
    } catch (error) {
        res.json({message: error})
    }
})
