const express = require('express')
const app = express()
const cors = require('cors')
const scrapingRoutes = require('./routes/scraping-routes')
const authRoutes = require('./routes/auth-routes')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/auth', authRoutes)
app.use('/scrape', scrapingRoutes)

app.get('/', (req, res) => {
    res.json({message: "We good"})
})

app.listen(port)