const { date } = require('../../lib/utils')
const db = require('../../config/db')
const fs = require('fs')


module.exports = {
    all() {

        try {
            const query = `
                  SELECT chefs.*, files.path AS image
                  FROM chefs
                  LEFT JOIN files ON (chefs.file_id = files.id)
                  `;
            return db.query(query);
          } catch (err) {
            console.error(err);
          }
    },
    create(data, fileId) {

        const query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            date(Date.now()).format,
            fileId
        ]

        return db.query(query, values)
    },
    find(id) {
        
        const query = `
        SELECT chefs.*, 
        count(recipes) AS total_recipes,
        files.path AS avatar
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id, files.path`;

            return db.query(query, [id])  
    },
    findRecipes(chefId) {
        return db.query(`
            SELECT recipes.* FROM recipes
            LEFT JOIN chefs ON recipes.chef_id = chefs.id
            WHERE chefs.id = $1
            
        `, [chefId])
    },
    chefRecipes(id) {
        return db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1`, [id]);
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
