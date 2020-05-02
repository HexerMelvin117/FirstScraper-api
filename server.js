const express = require('express')
const app = express()
const cors = require('cors')
const scrapingRoutes = require('./routes/scraping-routes')

app.use(scrapingRoutes)
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: "We good"})
})

app.listen(8080)