const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')


module.exports = {
    index(req, res) {

        Chef.all(function(chefs) {
            return res.render("admin/chefs/index", {chefs})
    
        })

    },
    create(req, res) {

        return res.render("admin/chefs/create")

    },
    post(req, res) {

        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        Chef.create(req.body, function(chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)

        })
    },
    show(req, res) {

        const { id } = req.params

        Chef.find(req.params.id, function(chef) {
            Chef.chefRecipes(req.params.id, function(recipes) {
                Chef.TotalRecipesByChefs(req.params.id, function(recipesByChef) {
                    
                    return res.render('admin/chefs/show', { chef, recipes, recipesByChef })
            })
        })
    })
            

    },
    edit(req, res) {

        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send("Chef not found")

            return res.render("admin/chefs/edit", { chef })

        })

    },
    update(req, res) {

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
