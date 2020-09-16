const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')


// exports.index = function(req, res) {

//     const { filter } = req.query;

//       if( filter ){
//       Recipe.findBy(filter, function(recipes){
//         return res.render('foodfy/search', { recipes, filter })

//       })

//     } else {
//       Recipe.all(function(recipes){
        
//         return res.render("foodfy/index", {recipes})
//       })
//     }
// }
// exports.about = function(req, res) {

//     return res.render("foodfy/about")
// }
// exports.recipesList = function(req, res) {
  
//     let { page, limit } = req.query;

//     page = page || 1
//     limit = limit || 3
//     let offset = limit * (page - 1)

    
//     const params = {
//       page,
//       limit,
//       offset,
//       callback(recipes) {
        
//         const pagination = {
//           total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
//           page
//         }
        
//         return res.render('foodfy/recipesList', { recipes, pagination })
//       }
//     }

//     Recipe.paginate(params)

//   }
// exports.chefsList = function(req, res) {

//     Chef.all(function(chefs) {

//         return res.render("foodfy/chefsList", {chefs})

//     })
    
      
// }

module.exports = {
  async index(req, res) {
    try {
      const { filter } = req.query;

      if( filter ){
      await Recipe.findBy(filter, function(recipes){
        return res.render('foodfy/search', { recipes, filter })

      })

    } else {
      const results = await Recipe.all()
      const recipes = results.rows

      if(!recipes) return res.send('Recipes Not Found!')

            async function getImage(recipeId) {
                let results = await File.recipeImages(recipeId)
                result = results.rows.map(recipe => 
                `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`)
    
                return result[0]
            }
    
            const recipesPromises = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id)
    
                return recipe
            })
    
            const recipesImage = await Promise.all(recipesPromises)
        
        return res.render("foodfy/index", {recipes, recipesImage})
      
    }
    }catch (err){
      console.error(err)
    }
  },
  async about(req, res) {

    // const results = await.about()
    return res.render("foodfy/about")

  },
  async recipesList(req, res) {
    try {
      const results = await Recipe.all();
      const recipes = results.rows

      if(!recipes) return res.send('Recipes Not Found!')

            async function getImage(recipeId) {
                let results = await File.recipeImages(recipeId)
                result = results.rows.map(recipe => 
                `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`)
    
                return result[0]
            }
    
            const recipesPromises = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id)
    
                return recipe
            })
    
            const recipesImage = await Promise.all(recipesPromises)
      

        return res.render('foodfy/recipesList', { recipes, recipesImage })

    }catch (err){
        console.error(err)
      }
  },
  async chefsList(req, res) {
    try {
      let results = await Chef.all()
      const chefs = results.rows.map((chef) => {
        return {
          ...chef,
          avatar: `${req.protocol}://${req.headers.host}${chef.avatar.replace("public", "")}`,
        }
      })
        return res.render("foodfy/chefsList", {chefs})
    }catch (err) {
      console.error (err)
    }
  },
  async search(req, res) {
    try {
        const { filter } = req.query
        if(!filter) return res.redirect('/')

        let results = await Recipe.search(filter)
        const RecipesPromise = results.rows.map(async recipe => {
            recipe.img = await File.findAllImages(req, recipe.id)

            return recipe
        })
        const recipes = await Promise.all(RecipesPromise)

        return res.render('foodfy/search', {filter, recipes})
    } catch (error) {
        console.log(`Database Error => ${error}`)
    }
    
  }
}