const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({ filename, path}) {
        try {
            const query = `
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)    
                RETURNING id
            `

            const values = [
                filename,
                path
            ]

            return db.query(query, values) 
        } catch (err) {
            console.error(err)
        }
    },
    findByRecipe(recipeId) {
        const query = `
        SELECT recipe_files.*, files.path AS path_file
            FROM recipe_files
            LEFT JOIN files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1
        `
        return db.query(query, [recipeId])
        
    },
    findAllImages(recipe_id) {
        return db.query (
            `SELECT * FROM files
                JOIN recipe_files ON (recipe_files.file_id = files.id)
            WHERE recipe_id = $1
            ORDER BY recipe_files.id ASC`, [recipe_id])
    },
    recipeImages(id) {
        try {
            const subquery = `(
                SELECT files.path FROM files
                LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
                WHERE recipe_files.recipe_id = $1
                LIMIT 1
                )
                `

            const query = `
                SELECT *, ${subquery} FROM recipes
                LEFT JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
                WHERE recipes.id = $1
                LIMIT 1
                `

            // return db.query(query, [id])
            return db.query(query, [id])

            
        } catch (error) {
            console.error(error)
        }
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]
    
            fs.unlinkSync(file.path)

            return db.query(`
            DELETE FROM files WHERE id = $1
        `, [id])
        }catch(err) {
            console.error(err)
    }

        
    },
    

}