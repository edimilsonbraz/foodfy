const db = require('../../config/db')
const { date } = require('../../lib/utils')
const fs = require('fs')




module.exports = {
    all() {
        try {
            return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY created_at DESC
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
    async findRecipeChef(id) {
        try {
            const results = await db.query(`SELECT recipes.*, 
                chefs.name AS author FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id=$1`, [id]);

            return results.rows[0];
        } catch (err) {
            console.error(err);
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
    async delete(recipeId) {
        try {
            let results = await db.query(`
                SELECT * FROM recipe_files
                WHERE recipe_files.recipe_id = $1
            `, [recipeId])

            const recipeFiles = results.rows
            const recipeFilesPromise = recipeFiles.map(async recipe_file => {
                let results = await db.query(`
                    SELECT files.*
                    FROM recipe_files
                    LEFT JOIN files ON recipe_files.file_id = files.id
                    WHERE recipe_files.id = $1
                `, [recipe_file.id])
                const file = results.rows[0]
    
                await db.query(`DELETE FROM recipe_files WHERE id = $1`, [recipe_file.id])
    
                fs.unlinkSync(file.path)
    
                await db.query(`DELETE FROM files WHERE id = $1`, [file.id])
            })
            await Promise.all(recipeFilesPromise)
    
            return db.query(`
                DELETE FROM recipes WHERE id = $1
            `, [recipeId])

        }catch (err) {
            console.error (err)
        }
    },
    files(id) {
        return db.query(`
            SELECT files.* 
            FROM files 
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id) 
            WHERE recipes.id = $1
        `, [id]);
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
        const { filter, limit, offset } = params;

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`;

        if (filter) {
            
            filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;

            totalQuery = `(
                SELECT count(*) FROM recipes
                    ${filterQuery}
                ) AS total
            `;
        }

        query = `
                SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
                ${filterQuery}
                ORDER BY recipes.updated_at DESC
                LIMIT $1 OFFSET $2
            `;

        return db.query(query, [limit, offset]);
    },
    search(filter) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            ORDER BY updated_at DESC
        `)
    }
    
}