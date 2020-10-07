const db = require('../../config/db')
// const { hash } = require('bcryptjs')
const fs = require('fs')

module.exports = {
    async all() {
        let query = "SELECT * FROM users"
 
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
                 
             ) VALUES ($1, $2, $3)    
             RETURNING id
             `
             //hash of password
            //  const passwordHash = await hash(data.password, 8)
 
             const values = [
                 data.name,
                 data.email,
                 data.password,
             ]
 
             const results = await db.query(query, values)
             return results.rows[0].id 
 
         } catch (err) {
             console.error (err)
         }
     },
}