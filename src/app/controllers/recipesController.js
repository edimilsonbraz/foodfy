const { date } = require('../../lib/utils')
const Recipe = require('./../models/Recipe')
const File = require('./../models/File')
const RecipeFiles = require('./../models/RecipeFiles')


module.exports = {
    async index(req, res) {
        try {
            user = req.session.userId 
            userAdmin = req.session.isAdmin

            let results = await Recipe.all() 
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
           
            return res.render("admin/recipes/index", {recipes, recipesImage})

            
        }catch (err) {
            console.error (err)
        }
    
    },
    async create(req, res) {
        //Pega Chefs
        try {
            const results = await Recipe.chefsSelectOptions()
            const chefs = results.rows
            return res.render("admin/recipes/create.njk", { chefs })
        }catch (err) {
            console.error (err)
        }

    },
    async post(req, res) {
        try {

        //Logica de salvar recipes
        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == "") {
                // return res.send("Por favor, preencha todos os campos")

                req.session.error = 'Por favor, preencha todos os campos.'
                return res.redirect('/admin/recipes/create')
            }
        }
        
        if (req.files.length == 0) {
            // return res.send("Por favor, envie pelo menos 1 imagem")
            req.session.error = 'Por favor, envie pelo menos uma imagem.';
            return res.redirect('/admin/recipes/create');
        }
        const UserId = req.session.userId

        const results = await Recipe.create(req.body, userId)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create ({...file}))
        
        const filesResults = await Promise.all(filesPromise)
        const recipeFiles = filesResults.map((file) => {
            const fileId = file.rows[0].id
            RecipeFiles.create(recipeId, fileId)
        })
        
        await Promise.all(recipeFiles)

        req.session.success = 'Receita criada com sucesso.'
            return res.redirect(`/admin/recipes/${recipeId}`)
        }catch (err) {
            console.error(err)
        }
           

    },
    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
            
            if(!recipe) return res.send("Recipe not found")

            results = await File.findAllImages(recipe.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("admin/recipes/show", { recipe, files })

        }catch (err) {
            console.error (err)
        }
        
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
            
            return res.render("admin/recipes/edit", {recipe, chefs, files })

        } catch (err) {
            console.error(err)
        }
    },
    async update(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == '' && key != 'removed_files') {
                    return res.send('Por favor, preencha todos os campos.')
                }
            }

            if (req.files.length != 0) {
                const newFilePromises = req.files.map(file =>
                    File.createRecipeFiles({ ...file, recipe_id: req.body.id }))

                await Promise.all(newFilePromises)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',') //separa por vírgulas [1,2,3,]
                const lastIndex = removedFiles.length - 1 //tira uma posição do lastIndex [1,2,3]
                removedFiles.splice(lastIndex, 1) 

                const removedFilesPromises = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromises)
                
            }

            await Recipe.update(req.body)

            req.session.success = 'Receita atualizada com sucesso.'
            return res.redirect(`/admin/recipes/${req.body.id}`)

        } catch (error) {
            console.error(error)
        }
            
    },
    async delete(req, res) {
        try {
            await RecipeFiles.delete(req.body.id)

            req.session.success = 'Receita deletada com sucesso.'
            return res.redirect('/admin/recipes')
            
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}
