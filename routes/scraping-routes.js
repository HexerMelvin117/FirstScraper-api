const app = module.exports = require('express')()
const scraperFuncs = require('../controllers/scraper-funcs')

app.get('/amazonproduct', async (req, res) => {
    let amzDetails = await scraperFuncs.getAmazonDetails(req.body.productLink)
    res.json(amzDetails)
})