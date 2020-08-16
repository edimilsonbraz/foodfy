const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')


exports.index = function(req, res) {

    return res.render("foodfy/index")
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

        return res.render("foodfy/recipesList", { recipes})

    })
    
}
exports.chefsList = function(req, res) {
    
    Chef.all(function(chefs) {

        return res.render("foodfy/chefsList", {chefs})

    })
      
}