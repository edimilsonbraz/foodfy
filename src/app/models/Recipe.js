const db = require('../../config/db')
const { date } = require('../../lib/utils')



module.exports = {
    all(callback) {

        db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY name
        `, function(err, results) {
            if (err) return res.send("Database error! All") 
            
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
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).format
        ]
    
        db.query(query, values, function(err, results) {
            if (err) return res.send("Database error! Post") 
            
            callback(results.rows[0])
        })  
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
    chefsSelectOptions(callback) {
        db.query(`SELECT name, id FROM chefs`, function(err, results) {
            if(err) throw 'Database Error! SelectOpt'

            callback(results.rows)
        })
    },
    paginate(params) {
        // const { filter, limit, offset, callback } = params

        // let query = "",
        //     filterQuery = "",
        //     totalQuery = `(
        //         SELECT count(*) FROM recipes
        //     ) AS total`


        //    if ( filter ) {
        //     filterQuery = `
        //     WHERE recipe.title ILIKE '%${filter}%'
        //     `

        //     totalQuery = `(
        //         SELECT count(*) FROM recipes
        //         ${filterQuery}
        //     ) as total`
        // }

        // query = `
        // SELECT recipes.*, ${totalQuery}, count(chefs) AS total_recipes 
        // FROM recipes
        // LEFT JOIN chefs ON (recipes.id = members.instructor_id)
        // ${filterQuery}
        // GROUP BY instructors.id LIMIT $1 OFFSET $2
        // `

        // db.query(query, [limit, offset], function(err, results) {
        //     if (err) throw 'Database Error!'

        //     callback(results.rows)
        // })
    }
}