const db = require ('../../config/db')

module.exports = {
    create(recipeId, fileId) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            )VALUES ($1, $2)
            RETURNING id    
        `
        const values = [
            recipeId, 
            fileId
        ]

        return db.query(query, values)
    },
    async delete({ file_id, recipe_id }) {
        try {
            return db.query(`DELETE FROM recipe_files WHERE recipe_id = $1 AND file_id = $2`, [recipe_id, file_id]);

            // return db.query(`DELETE FROM recipes WHERE id=$1`, [id])
        } catch (error) {
            console.error(error);
        }
        
    },
    
}