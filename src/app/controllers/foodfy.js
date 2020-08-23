const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')


exports.index = function(req, res) {

    const { filter } = req.query;

      if( filter ){
      Recipe.findBy(filter, function(recipes){
        return res.render('foodfy/search', { recipes, filter })

      })

    } else {
      Recipe.all(function(recipes){
        
        return res.render("foodfy/index", { recipes })
      })
    }
}
exports.about = function(req, res) {

    return res.render("foodfy/about")
}
exports.recipesList = function(req, res) {
  
    let { page, limit } = req.query;

    page = page || 1
    limit = limit || 3
    let offset = limit * (page - 1)

    
    const params = {
      page,
      limit,
      offset,
      callback(recipes) {
        
        const pagination = {
          total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
          page
        }
        
        return res.render('foodfy/recipesList', { recipes, pagination })
      }
    }

    Recipe.paginate(params)

  }
exports.chefsList = function(req, res) {

    Chef.all(function(chefs) {

        return res.render("foodfy/chefsList", {chefs})

    })
    
      
}