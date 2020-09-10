const { date } = require('../../lib/utils')
const Recipe = require('./../models/Recipe')
const File = require('./../models/File')
const RecipeFiles = require('./../models/RecipeFiles')


module.exports = {
    index(req, res) {

        Recipe.all() 
        .then(function(results) {

            const recipes = results.rows
            return res.render("admin/recipes/index", {recipes})

        }).catch(function(err) {
            throw new Error(err)

        })
           
    
    },
    create(req, res) {
        //Pega Chefs
        Recipe.chefsSelectOptions() 
        .then(function(results) {
            const chefs = results.rows
            return res.render("admin/recipes/create.njk", { chefs })
        }).catch(function(err) {
            throw new Error(err)

        })

    },
    async post(req, res) {
        //Logica de salvar recipes
        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }
        
        if (req.files.length == 0)
            return res.send("Por favor, envie pelo menos 1 imagem")

        const results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create ({...file}))
        
        const filesResults = await Promise.all(filesPromise)
        const recipeFiles = filesResults.map((file) => {
            const fileId = file.rows[0].id
            RecipeFiles.create(recipeId, fileId)
        })
        await Promise.all(recipeFiles)
            return res.redirect(`/admin/recipes/${recipeId}`)
           

    },
    async show(req, res) {

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]
            
            if(!recipe) return res.send("Recipe not found")

            recipe.created_at = date(recipe.created_at).format

            return res.render("admin/recipes/show", { recipe })
        

    },
    async edit(req, res) {

        let results = await Recipe.find(req.params.id) 
        const recipe = results.rows[0]

            if (!recipe) return res.send("Recipe not found")

        //get chefs
        results = await Recipe.chefsSelectOptions() 
        const chefs = results.rows

            return res.render("admin/recipes/edit", { recipe, chefs });
            

    },
    update(req, res) {

        const keys = Object.keys(req.body) 

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }
        const { chef_id, image, title, ingredients, preparation, information, id } = req.body;

        const data = [
          chef_id,
          image,
          title,
          ingredients,
          preparation,
          information,
          id
        ];

        Recipe.update(req.body, function () {
    
            return res.redirect(`/admin/recipes/${id}`)
        })
            
    },
    delete(req, res) {

        Recipe.delete(req.body.id, function () {

            return res.redirect("/admin/recipes")
        })
    },
}
