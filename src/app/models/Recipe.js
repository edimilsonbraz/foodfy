const db = require('../../config/db')
const { date } = require('../../lib/utils')



module.exports = {
    all(callback) {

        db.query(`SELECT * FROM recipes`, function(err, results) {
            if (err) return res.send("Database error! Post") 
            
            callback(results.rows)
        })

    },
    create(data, callback ) {

        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.igredients,
            data.preparation,
            data.information,
            date(Date.now())
        ]
    
        db.query(query, values, function(err, results) {
            if (err) return res.send("Database error! Post") 
            
            callback(results.rows[0])
        })  
    },
    find(id, callback) {
        db.query(`
            SELECT * 
            FROM recipes 
            WHERE id = $1`, [id], function(err, results) {
                if (err) return res.send("Database error! Find") 
                callback(results.rows[0])
            })
        }
}