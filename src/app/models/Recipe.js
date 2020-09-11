const db = require('../../config/db')
const { date } = require('../../lib/utils')




module.exports = {
    all() {

        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY name
        `)

    },
    create(data) {

        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).format
        ]
    
        return db.query(query, values) 

    },
    find(id) {
        return db.query (`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id])
    },
    findBy(filter){
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY chef_name`);
    },
    update(data) {

        const query = `
            UPDATE recipes SET 
                title=($1),
                chef_id=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
             WHERE id = $6
            `

        const values = [
            data.title,
            data.chef,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id, callback) {

        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()

        })
        
    },
    chefsSelectOptions() {
        return db.query(`
        SELECT name, id FROM chefs
        `)
    },
    paginate(params) {
    const { limit, offset, callback } = params;

        let query = "",

            totalQuery = `(
            SELECT count(*) FROM recipes
            ) AS total`

        query = `
        SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.id DESC
        LIMIT $1 OFFSET $2`

        db.query(query, [limit, offset], (err, results) => {

            if(err) throw `Database Error! ${err}`

                callback(results.rows)
        
        })
  
    
    },
}