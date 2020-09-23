const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')


module.exports = {
    async index(req, res) {
        try {
            const results = await Chef.all();
            let chefs = results.rows.map((chef) => {
              return {
                ...chef,
                image: chef.image
                  ? `${req.protocol}://${req.headers.host}${chef.image.replace(
                      "public","")}`: "", }})
      
            return res.render("admin/chefs/index", { chefs })

          } catch (err) {
            console.error(err);
        }
    },
    async create(req, res) {

        return res.render("admin/chefs/create")

    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "") return res.send('Please, fill all the fields!')
            }
            
            if(req.file == 0) return res.send('Please, select an avatar')

            let results = await File.create({...req.file})
            const fileId = results.rows[0].id
      
            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id
      
            return res.redirect(`/admin/chefs/${chefId}`)

          } catch (err) {
            console.error(err);
          }
    },
    async show(req, res) {
        try {
            const { id } = req.params;
                let results = await Chef.find(id);
                let chef = results.rows[0];
                chef = {
                ...chef,
                image: chef.image
                    ? `${req.protocol}://${req.headers.host}${chef.image.replace(
                        "public", "" )}` : "",
                }

            results = await Recipe.find(id)
            // const recipes = results.rows
            const recipesPromise = results.rows.map(async recipe=>{
                const recipePath = await File.findByRecipe(recipe.id);
                  const path = recipePath.rows[0].path_file;
                  recipe.path = `${req.protocol}://${req.headers.host}${path.replace(
                    "public", "" )}`;
                  return recipe
              })
              
              const recipes = await Promise.all(recipesPromise)
            
                return res.render("admin/chefs/show", { chef, recipes })

        } catch (err) {
            console.error (err)
        }

    },
    async edit(req, res) {
        try {
            const { id } = req.params;
            const results = await Chef.find(id);
            const chef = results.rows[0]
            console.log(chef)

                return res.render("admin/chefs/edit", { chef });
    
        }catch (err) {
            console.error (err)
        }

    },
    async update(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "") return res.send('Please, fill all the fields!')
            }

            let fileId
            if(req.file != 0) {
                const result = await File.create({...req.file})
                fileId = result.rows[0].id
            }

            await Chef.update(req.body, fileId)

            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    
    },
    async delete(req, res) {
        try {
            
        let results = await Chef.find(req.body.id);

            if (results.rows[0].total_recipes == 0) {
                await Chef.delete(req.body.id);
                return res.redirect("/admin/chefs")         
            } else {
                return res.send("Chefs who have recipes on our website cannot be deleted");
            }
     
        }catch (err) {
            console.error (err)
        }
    }
}
