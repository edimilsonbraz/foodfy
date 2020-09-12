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
        
        return res.render("foodfy/index", {recipes})
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

// module.exports = {
//   async index(req, res) {
//     try {
//       const { filter } = req.query;

//       if( filter ){
//       Recipe.findBy(filter, function(recipes){
//         return res.render('foodfy/search', { recipes, filter })

//       })

//     } else {
//       const results = await Recipe.all()
//       const recipes = results.rows
//       console.log(recipes)
        
//         return res.render("foodfy/index", {recipes})
      
//     }
//     }catch (err){
//       console.error(err)
//     }
//   },
//   about(req, res) {

//     return res.render("foodfy/about")
//   },
//   async recipesList(req, res) {
//     try {
//       const results = await Recipe.all();
//       const recipes = results.rows;
//       let { page, limit } = req.query;

//         page = page || 1
//         limit = limit || 3
//         let offset = limit * (page - 1)

    
//       const params = {
//         page,
//         limit,
//         offset,
//         callback(recipes) {
          
//           const pagination = {
//             total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
//             page
//           }
          
//           return res.render('foodfy/recipesList', { recipes, pagination })
//         }
//       }

//       const results = Recipe.paginate(params)
//     }catch (err){
//       console.error(err)
//     }
//   },
//   async chefsList(req, res) {
//     try {
//       let results = Chef.all()
//       const chefs = results.rows.map((chef) => {
//         return {
//           ...chef,
//           avatar: `${req.protocol}://${req.headers.host}${chef.avatar.replace("public", "")}`,
//         }
//       })
//         return res.render("foodfy/chefsList", {chefs})
//     }catch (err) {
//       console.error (err)
//     }
//   }
// }