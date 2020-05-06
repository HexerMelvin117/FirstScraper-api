const app = module.exports = require('express')()
const scraperFuncs = require('../controllers/scraper-funcs')
const { saveToDatabase, getSavedProducts } = require('../controllers/productManagement')

// Gets specific amazon product information
app.post('/amazonproduct', async (req, res) => {
    let amzDetails = await scraperFuncs.getAmazonDetails(req.body.productLink)
    res.json(amzDetails)
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

app.post('/saveproduct', async (req, res) => {
    if (req.isAuthenticated() !== false) {
        let userId = req.session.passport.user
        await storeProductInDatabase(req, userId)
        res.json({message: "product stored in database"})
    } else {
        res.json({message:"an error has ocurred"})
    }
})

app.get('/getproducts', async (req, res) => {
    let savedProducts = await getSavedProducts()
    res.json(savedProducts.rows) 
})

