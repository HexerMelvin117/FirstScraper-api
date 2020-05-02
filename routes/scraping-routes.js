const app = module.exports = require('express')()
const scraperFuncs = require('../controllers/scraper-funcs')

// Gets specific amazon product information
app.get('/amazonproduct', async (req, res) => {
    let amzDetails = await scraperFuncs.getAmazonDetails(req.body.productLink)
    res.json(amzDetails)
})