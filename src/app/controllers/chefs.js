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
            const recipes = results.rows
            
                return res.render("admin/chefs/show", { chef, recipes })

        } catch (err) {
            console.error (err)
        }

    },
    edit(req, res) {

        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send("Chef not found")

            return res.render("admin/chefs/edit", { chef })

        })

    },
    async update(req, res) {

            const keys = Object.keys(req.body)//CRIA UM OBJETO QUE TEM VARIAS FUNÇÕES//CRIOU UM ARRAY DE CHAVES -> { }
            for (key of keys) { 
                if (req.body[key] == "") {
                    return res.send('Please, fill all fields!')
                }
            }
    
           Chef.update(req.body, function() {
               return res.redirect(`/admin/chefs/${req.body.id}`)
            })
    
    },
    delete(req, res) {

        const { id } = req.body

        Chef.TotalRecipesByChefs(id, chef => {
            let { total_recipes } = chef
    
            total_recipes = Number(total_recipes)
    
            if (chef.total_recipes <= 0) {
                Chef.delete(id, () => {
                    return res.redirect('/admin/chefs')
                })
                
            } else {
                return res.send("You cannot delete a chef that has recipes!!")
            }
        
        })

    },
}
