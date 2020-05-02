const express = require('express')
const app = express()
const cors = require('cors')
const scrapingRoutes = require('./routes/scraping-routes')
const authRoutes = require('./routes/auth-routes')

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/scrape', scrapingRoutes)
app.use(cors())

app.get('/', (req, res) => {
    res.json({message: "We good"})
})

app.listen(8080)