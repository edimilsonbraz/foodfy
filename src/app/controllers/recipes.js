const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')


module.exports = {
    index(req, res) {

        Recipe.all(function(recipes) {
            return res.render("admin/recipes/index", {recipes})
    
        })

    },
    create(req, res) {

        return res.render("admin/recipes/create")

    },
    post(req, res) {

        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        Recipe.create(req.body, function(recipe) {
            
            return res.redirect(`/admin/recipes/${recipe.id}`)

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

        const { id } = req.params
    
    const foundRecipe = data.recipes.find(function(recipe) {
        return recipe.id == id
    })

    if(!foundRecipe) return res.send("Recipe not found")

    return res.render("admin/recipes/edit", { recipe: foundRecipe })

    },
    put(req, res) {

        const { id } = req.body
        let index = 0
    
        const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
            if (id == recipe.id) {
                index = foundIndex
                return true
            }
        })
    
        if(!foundRecipe) return res.send("Recipe not found")
    
        const recipe = {
            ...foundRecipe,
            ...req.body,
            id: Number(req.body.id) //transforma a string em um numero
        }
    
        data.recipes[index] = recipe
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if(err) return res.send("Write file error!")
    
            return res.redirect(`/admin/recipes/${id}`)
        })

    },
    delete(req, res) {

        const { id } = req.body

    const filteredRecipes = data.recipes.filter(function(recipe) {
        return recipe.id != id
    })

    data.recipes = filteredRecipes

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("write file error!")

        return res.redirect("/admin/recipes")
    })

    },
}


