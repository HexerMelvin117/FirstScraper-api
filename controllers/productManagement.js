const { pool } = require('./dbconfig')

const saveToDatabase = async (userId, productUrl, productTitle, productImage, productValue) => {
    await pool.query(`INSERT INTO savedproducts (prod_url, prod_title, prod_img, prod_value, user_id)
                    VALUES ($1, $2, $3, $4, $5)`, [productUrl, productTitle, productImage, productValue, userId])
}

const getSavedProducts = async (userId) => {
    let response = await pool.query(`SELECT * FROM savedproducts WHERE user_id = $1`, [userId])
    return response
}

const removeSavedProduct = async (userId, productTitle) => {
    let response = await pool.query(`DELETE FROM savedproducts WHERE prod_title=$1 AND user_id=$2` [productTitle, userId])
}

module.exports = {
    saveToDatabase,
    getSavedProducts,
    removeSavedProduct
}