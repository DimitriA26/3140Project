const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.db");function getProduct(product_name) 
{
    db.all
    (
        `SELECT * FROM products 
        WHERE LOWER(product_name) 
        LIKE LOWER(?)`,
        [`%${product_name}%`],
         (err, rows) => {
            if (err) 
                {
                console.error(err);
                return;
                }

            console.log(rows);
         }
    );
}

module.exports = { getProduct };