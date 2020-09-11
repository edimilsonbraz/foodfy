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
        try {
            const { id } = req.params;

            let results = await Recipe.find(req.params.id) 
            const recipe = results.rows[0]

                if (!recipe) return res.send("Recipe not found")

            //get chefs
            results = await Recipe.chefsSelectOptions() 
            const chefs = results.rows

             //get images
            results = await File.findByRecipe(id);
            let files = results.rows
            files = files.map((file) => ({   //map devolve um novo Array como resultado.
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path_file.replace("public", "")}`
            }))
            console.log(files)
            return res.render("admin/recipes/edit", {recipe, chefs, files })
        } catch (err) {
            console.error(err)
        }
    },
    async update(req, res) {

        const keys = Object.keys(req.body) 

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Please, fill all fields!')
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file =>
                File.create({...file}))// tentar pegar o id aqui

            await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",") //[1,2,3,]
            const lastIndex = removedFiles.length -1
            removedFiles.splice(lastIndex, 1) //[1,2,3]

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            
            await Promise.all(removedFilesPromise)
        }

        
        await Recipe.update(req.body)
    
        return res.redirect(`/admin/recipes/${id}`)
    
            
    },
    async delete(req, res) {

        await Recipe.delete(req.body.id)

            return res.redirect("/admin/recipes")
        
    }
}
