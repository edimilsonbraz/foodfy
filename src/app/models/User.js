const db = require('../../config/db')
const { hash } = require('bcryptjs')


module.exports = {
    async list() {
        const query = `
        SELECT * FROM users
        ORDER BY updated_at DESC
        `

        const results = await db.query(query)
        return results.rows        
    },
    async findOne(filters) {
        let query = `SELECT * FROM users`

       Object.keys(filters).map(key => {
           //where | or | and
           query = `${query}
           ${key}
           `

           Object.keys(filters[key]).map(field => {
               query = `${query} ${field} = '${filters[key] [field]}'`
           })
       })

       const results = await db.query(query)

       return results.rows[0]
    },
    async create(data) {
         try {
             const query = `
             INSERT INTO users (
                 name,
                 email,
                 password,
                 is_admin
             ) VALUES ($1, $2, $3, $4)    
             RETURNING id
             `
            
             //hash of password
             const passwordHash = await hash(data.password, 8)
 
             const values = [
                 data.name,
                 data.email,
                 passwordHash,
                 data.is_admin || false
             ]
 
             const results = await db.query(query, values)
             return results.rows[0].id 
 
         } catch (err) {
             console.error (err)
         }
    },
    async put(id, fields) {
        try {
            let query = "UPDATE users SET"
    
            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length) {
                    query = `${query}
                        ${key} = '${fields[key]}',
                    `
                } else {
                    query = `${query}
                        ${key} = '${fields[key]}'
                        WHERE id = ${id}
                    `
                }
            })
    
            await db.query(query)
    
            return

        }catch(error) {
            console.log(`Database PUT Error => ${error}`)
        }
    },
    async delete(id) {
        const query = `
            DELETE FROM users WHERE id = $1
        `;

        return db.query(query, [id]);
    }
}