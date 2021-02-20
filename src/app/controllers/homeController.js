const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')



module.exports = {
  async index(req, res) {
    try {
      const { filter } = req.query

      if( filter ){
      await Recipe.find(filter, function(recipes){
        return res.render('home/search', { recipes, filter })

      })

    } else {
      let results = await Recipe.all()
      let recipes = results

      if(!recipes) return res.send('Receita não encontrada')

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
    
            let recipesImage = await Promise.all(recipesPromises)
        
        return res.render("home/index", { recipes, recipesImage })
      
    }
    }catch (err){
      console.error(err)
    }     
  },
  async about(req, res) {

    // const results = await.about()
    return res.render("home/about")

  },
  async recipesList(req, res) {
    try {
      let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6

        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset
        }

        let results = await Recipe.paginate(params)
        let recipes = results.rows

        let mathTotal = recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit )

        const pagination = {
            total: mathTotal,
            page
        }

        if(!recipes){
            return res.send("Recipes not found");
        }

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
      

        return res.render('home/recipesList', { recipes: recipesImage, pagination, filter })

    }catch (err){
        console.error(err)
      }
  },
  async recipeDetails(req, res) {
    try {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]
        
        if(!recipe) {
            return res.render('home/recipeDetails', {
                error: 'Receita não encontrada!'
            }) 
        } 
            

        results = await File.findAllImages(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("home/recipeDetails", { recipe, files })

    }catch (err) {
        console.error (err)
    }
    
  },
  async chefsList(req, res) {
    try {
      results = await Chef.all()
      let chefs = results.rows.map((chef) => {
        return {
          ...chef,
          image: chef.image
            ? `${req.protocol}://${req.headers.host}${chef.image.replace(
                "public","")}`: "",
        }
      })

        return res.render("home/chefsList", { chefs })

    } catch (err) {
      console.error(err)
    }
  },
  async chefDetails(req, res) {
    try {
        const { id } = req.params
            let results = await Chef.find(id)
            let chef = results.rows[0]
            chef = {
            ...chef,
            image: chef.image
                ? `${req.protocol}://${req.headers.host}${chef.image.replace(
                    "public", "" )}` : "",
            }

            results = await Chef.findRecipesByChefId(chef.id);
        
        const recipesPromise = results.rows.map(async recipe=>{
            const recipePath = await File.findByRecipe(recipe.id)
              const image = recipePath.rows[0].path_file;
              recipe.image = `${req.protocol}://${req.headers.host}${image.replace(
                "public", "" )}`

              return recipe
          })
          
          const recipes = await Promise.all(recipesPromise)
        
            return res.render("home/chefDetails", { chef, recipes })

    } catch (err) {
        console.error (err)
    }

  },
  async search(req, res) {
    try {
        const { filter } = req.query

        if(!filter) return res.redirect('/')

        let results = await Recipe.search(filter)

        async function getImage(recipeId) {
          let results = await File.recipeImages(recipeId)
          const files = results.rows.map(recipe => `${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`)

          return files[0]
      }

        const recipesPromise = results.rows.map(async recipe => {
          recipe.image = await getImage(recipe.id)

          return recipe
        })

        const recipes = await Promise.all(recipesPromise)

          return res.render('home/search', {filter, recipes})

    } catch (error) {
        console.log(`Database Error ${error}`)
    }
    
  }
}