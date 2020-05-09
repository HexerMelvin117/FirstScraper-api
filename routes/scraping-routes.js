const app = module.exports = require('express')()
const scraperFuncs = require('../controllers/scraper-funcs')
const { getSavedProducts } = require('../controllers/productManagement')

// Gets specific amazon product information
app.post('/amazonproduct', async (req, res) => {
    let amzDetails = await scraperFuncs.getAmazonDetails(req.body.productLink)
    res.json(amzDetails)
})

app.get('/getproducts', async (req, res) => {
    let savedProducts = await getSavedProducts()
    res.json(savedProducts.rows) 
})

app.get('/test', (req, res) => {
    res.json(req.user)
})

