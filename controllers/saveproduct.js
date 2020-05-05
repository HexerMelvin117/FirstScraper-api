const { pool } = require('./dbconfig')

const saveToDatabase = async (userId, productUrl, productTitle, productImage, productValue) => {
    await pool.query(`INSERT INTO savedproducts (prod_url, prod_title, prod_img, prod_value, user_id)
                    VALUES ($1, $2, $3, $4, $5)`, [productUrl, productTitle, productImage, productValue, userId])
}

module.exports = {
    saveToDatabase
}