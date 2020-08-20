const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')


exports.index = function(req, res) {

    Recipe.all(function(recipes) {

        return res.render("foodfy/index", { recipes })

    })
}
exports.about = function(req, res) {

    return res.render("foodfy/about")
}
exports.recipe = function (req, res) {
  
    const recipeId = req.params.id
  
    return res.render("foodfy/recipe", {recipes: recipe[recipeId]} )
}
exports.recipesList = function(req, res) {
      
    Recipe.all(function(recipes) {
     Recipe.find(req.params.id, function(recipe) {

        return res.render("foodfy/recipesList", { recipe, recipes})

        })
    })
    
}
exports.chefsList = function(req, res) {

    
    Chef.all(function(chefs) {
        // Chef.TotalRecipesByChefs(req.params.id, function(recipesByChef) {

        return res.render("foodfy/chefsList", {chefs})

        })
    // })
      
}