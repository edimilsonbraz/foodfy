const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')


module.exports = {
    index(req, res) {

        Recipe.all(function(recipes) {
            return res.render("admin/recipes/index", {recipes})
    
        })

    },
    create(req, res) {

        Recipe.chefsSelectOptions(function(options) {
            return res.render("admin/recipes/create", { chefOptions: options })

        })

    },
    post(req, res) {

        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        Recipe.create(req.body, function(recipe) {
            return res.redirect(`admin/recipes/${recipe.id}`)

        })
    },
    show(req, res) {

        Recipe.find(req.params.id, function(recipe) {
            if(!recipe) return res.send("Recipe not found")

            recipe.chef_id = recipe.chef_id 
            recipe.image = recipe.image
            recipe.title = recipe.title
            recipe.ingredients = recipe.ingredients
            recipe.preparation = recipe.preparation
            recipe.information = recipe.information
            recipe.create_at = date(recipe.create_at).format

            return res.render("/admin/recipes/show", { recipe })
        })

    },
    edit(req, res) {


        return res.render("admin/recipes/edit", { recipe })

    },
    update(req, res) {

            return res.redirect(`/admin/recipes/${id}`)

    },
    delete(req, res) {

        return res.redirect("/admin/recipes")


    },
}


