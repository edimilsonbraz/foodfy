



exports.index = function(req, res) {

    return res.render("foodfy/index")
}

exports.about = function(req, res) {

    return res.render("foodfy/about")
}

exports.recipe = function (req, res) {
  
    const recipeId = req.params.id
  
    // console.log(recipeId);
  
    return res.render("foodfy/recipe", {recipes: recipe[recipeId]} )
}

exports.recipesList = function(req, res) {
      
    return res.render("foodfy/recipesList", { recipes: data.recipes})
}