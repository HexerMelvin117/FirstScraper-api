const app = module.exports = require('express')()
const signupFuncs = require('../controllers/signup-funcs')
const loginFuncs = require('../controllers/login-funcs')
const passport = require('passport')
const { initialize } = require('../controllers/passportconfig')
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require('cookie-parser')
require("dotenv").config();

initialize(passport)
app.use(cookieParser())

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
);

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());

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

app.get('/login', (req, res, next) => {
    if (req.session.user !== undefined) {
        next();
        console.log(req.session.passport)
    } else {
        res.redirect("/login");
        console.log(req.session.passport)
        console.log(req.user)
    }
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/logout', (req, res) => {
    req.logout()
    res.json({message: "You have succesfully logged out"})
})

