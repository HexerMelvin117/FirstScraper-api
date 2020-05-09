const app = module.exports = require('express')()
const signupFuncs = require('../controllers/signup-funcs')
const passport = require('passport')
const { initialize } = require('../controllers/passportconfig')
const flash = require("express-flash");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { saveToDatabase, getSavedProducts, removeSavedProduct } = require('../controllers/productManagement')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
require("dotenv").config();

initialize(passport)

passport.use(new JWTstrategy({
    secretOrKey : 'top_secret',
    jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
  }, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }));
app.use(cookieParser())
app.use(passport.initialize())

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

const checkAuth = (req, res) => {
    var token = req.body.token
    if (!token) return res.status(403).send({ auth: false, message: 'No token was provided' });
    jwt.verify(token, 'top_secret', (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Token could no be authenticated' });
        req.user = {
            user_id: decoded.user.user_id,
            user_email: decoded.user.user_email
        }
        console.log(req.user)
    })
}

app.post('/check', (req, res) => {
    let response = checkAuth(req, res)
    console.log(response)
})

app.post('/login', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        try {
            if(err || !user){
                console.log("error")
                const error = new Error('An Error occurred')
                return next(error);
            }
            req.login(user, { session : false }, async (error) => {
                if( error ) return next(error)
                const body = { user_id : user.user_id, user_email : user.user_email };
                const token = jwt.sign({ user : body },'top_secret', {expiresIn: 10 * 60});
                return res.json({ token, user });
            }); 
        } catch (error) {
            console.log(error)
            throw error
        }
    })(req, res, next)
})

app.get('/logout', (req, res) => {
    req.logout()
    res.json({message: "You have succesfully logged out"})
})

let storeProductInDatabase = async (req, userId) => {
    try {
        let product = req.body
        let { productUrl, productTitle, productImage, productValue } = product
        await saveToDatabase(userId, productUrl, productTitle, productImage, productValue)
    } catch (error) {
        throw error
    }
}

// Saves the product to the database
app.post('/saveproduct', async (req, res) => {
    checkAuth(req, res)
    console.log(req.user)
    let userId = req.user.user_id
    await storeProductInDatabase(req, Number(userId))
})

// Gets all products associated with an account
app.post('/allproducts', async (req, res) => {
    try {
        checkAuth(req, res)
        let userId = req.user.user_id
        let response = await getSavedProducts(userId)
        res.json(response.rows)
    } catch (error) {
        throw error;
    }
    
})

// Removes saved product from database
app.post('/removeproduct', async (req, res) => {
    try {   
        checkAuth(req, res)
        let userId = req.user.user_id
        let productTitle = req.body.productTitle
        await removeSavedProduct(userId, productTitle)
        res.json({message: "product removed succesfully"})
    } catch (error) {
        throw error;
    }
})

