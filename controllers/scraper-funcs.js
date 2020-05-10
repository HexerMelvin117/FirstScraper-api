const puppeteer = require('puppeteer')

async function getAmazonDetails(url) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"]
        })
        const page = await browser.newPage()
        await page.goto(url)

        // Get image URL
        const [imgEl] = await page.$x('//*[@id="landingImage"]')
        const imageSource = await imgEl.getProperty('src')
        const imageSourceTxt = await imageSource.jsonValue()

        // Get title text
        const [titleEl] = await page.$x('//*[@id="productTitle"]')
        const titleContent = await titleEl.getProperty('textContent')
        const titleText = await titleContent.jsonValue()

        // Get price information
        const [priceEl] = await page.$x('//*[@id="priceblock_ourprice"]')
        if (priceEl === undefined) {
            return {
                imageSourceTxt, 
                titleText: titleText.trim(),
                priceValue: "price not displayed",
                productUrl: url
            }
        }
        
        const priceContent = await priceEl.getProperty('textContent')
        const priceText = await priceContent.jsonValue()
        const priceValue = await priceText.replace('$', '')

        return {
            imageSourceTxt, 
            titleText: titleText.trim(),
            priceValue: priceValue,
            productUrl: url
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAmazonDetails
}