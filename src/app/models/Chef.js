const db = require('../../config/db')
const { date } = require('../../lib/utils')


module.exports = {
    all() {

        db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC
        `)

    },
    create(data, callback) {

        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).format
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error!Create ${err}`

            callback(results.rows[0])
            
        })
    },
    find(id, callback) {
        db.query(`
        SELECT * 
        FROM chefs 
        WHERE id = $1`, [id], function(err, results) {
        if(err) throw `Database Error!Find ${err}`

                callback(results.rows[0])

        })
    },
    chefRecipes(id, callback) {
        db.query(`
        SELECT *
        FROM recipes
        WHERE chef_id = $1`, [id], function(err, results) {
            if(err) throw `Database error: ${err}`

            callback(results.rows)
        })
    },
    update(data, callback) {

        const query = `
        UPDATE chefs SET
            name=($1),
            avatar_url=($2)
        WHERE id = $3
        `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]
        
        db.query(query, values, function(err, results) {
            if(err) throw `Database Error!Update ${err}`

            callback()
        })
    },
    delete(id, callback) {

        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error!Delete ${err}`

            return callback()

        })
    },
    TotalRecipesByChefs(id, callback) {
        const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
        `
        db.query(query, [id], function(err, results) {
            if(err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    async getAvatar(id) {
        try {
            const query = `
            SELECT files.* FROM files 
            LEFT JOIN chefs ON (chefs.file_id = files.id)
            WHERE chefs.id = $1
            `

            const results = await db.query(query, [id])

            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },
    async paginate({ limit, offset }) {
        try {
            let query = '',
                totalQuery = `(
                SELECT count(*) FROM chefs
            ) AS total
            `


            query = `
        SELECT chefs.*, ${totalQuery}, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY updated_at DESC
        LIMIT $1 OFFSET $2
        `

            const results = await db.query(query, [limit, offset])

            return results.rows
        } catch (error) {
            console.error(error)
        }
    }
}
