const db = require('../../config/db')
const { date } = require('../../lib/utils')




module.exports = {
    all() {
        try {
            return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY name
            `)
        }catch (err) {
            console.error (err)
        }

    },
    create(data) {
        try {
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
        }catch (err) {
            console.error (err)
        }

    },
    find(id) {
        try {
            return db.query (`
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1`, [id])
        } catch (err) {
            console.error (err)
        }
        
    },
    findBy(filter){
        try {
            return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
            ORDER BY chef_name`);
        
        }catch (err) {
            console.error (err)
        }
    },
    update(data) {
        try {
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
        }catch (err) {
            console.error (err)
        }
    },
    delete(id, callback) {
        try {
            db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
                if(err) throw `Database Error! ${err}`
    
                return callback()
    
            })

        }catch (err) {
            console.error (err)
        }
        
    },
    chefsSelectOptions() {
        try {
            return db.query(`
            SELECT name, id FROM chefs
            `)
        }catch (err) {
            console.error (err)
        }
    },
    paginate(params) {
        try {
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
        }catch (err) {
            console.Error (err)
        }
    },
    
}