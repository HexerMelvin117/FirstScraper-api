const app = module.exports = require('express')()
const signupFuncs = require('../controllers/signup-funcs')

app.post('/signup', (req, res) => {
    try {
        user = req.body
        let validUser = signupFuncs.checkRegistrationFields(user)

        if (validUser === true) {
            signupFuncs.submitUserInfo(user)
            res.json({message: "user succesfully created"})
        }
        res.json({message: "User could not be created"})
    } catch (error) {
        res.json({message: error})
    }
})