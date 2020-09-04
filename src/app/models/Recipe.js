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
    find(id, callback) {
        db.query (`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id], function(err, results){
                if(err) throw `Database error! ${err}`

                callback(results.rows[0])
            })
    },
    findBy(filter, callback){
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY chef_name`, function(err, results){
          if(err) throw `Database Error! ${err}`;
          callback(results.rows)
        });
    },
    update(data, callback) {

        const query = `
            UPDATE recipes SET 
                image=($1),
                title=($2),
                chef_id=($3),
                ingredients=($4),
                preparation=($5),
                information=($6)
             WHERE id = $7
            `

        const values = [
            data.image,
            data.title,
            data.chef,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`


            callback()
        })
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