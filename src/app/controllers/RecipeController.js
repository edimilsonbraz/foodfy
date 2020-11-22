const { date } = require('../../lib/utils')
const Recipe = require('./../models/Recipe')
const File = require('./../models/File')
const RecipeFiles = require('./../models/RecipeFiles')


module.exports = {
    async index(req, res) {
        try {
        let { page, limit, filter } = req.query

        page = page || 1
        limit = limit || 6

        let offset = limit * (page - 1)

        const params = {
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


            user = req.session.userId 
            userAdmin = req.session.isAdmin

            results = await Recipe.all() 
            recipes = results.rows

            if(!recipes) {
                return res.render('admin/recipes/index', {
                    error: 'Receita não encontrada!'
                }) 
            }

            async function getImage(recipeId) {
                let results = await File.recipeImages(recipeId)
                result = results.rows.map(recipe => 
                `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`)
    
                return result[0]
            }
    
            const recipesPromises = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id)

                if (recipe.user_id == req.session.userId) recipe.creator = true
    
                return recipe
            })
    
            const recipesImage = await Promise.all(recipesPromises)
           
            return res.render("admin/recipes/index", {recipes, recipesImage, pagination, filter})

            
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

                return res.render('admin/recipes/create', {
                    error: 'Por favor, preencha todos os campos.'
                })
            }
        }
        
        if (req.files.length == 0) {
            return res.render('admin/recipes/create', {
                error: 'Por favor, envie pelo menos uma imagem.'
            });
        }
        const userId = req.session.userId

        const results = await Recipe.create(req.body, userId)
        const recipeId = results.rows[0].id


        const filesPromise = req.files.map(file => File.create ({...file}))
        
        const filesResults = await Promise.all(filesPromise)
        const recipeFiles = filesResults.map((file) => {
            const fileId = file.rows[0].id
            RecipeFiles.create(recipeId, fileId)
        })
        
        await Promise.all(recipeFiles)

            return res.render("orders/success")
        }catch (err) {
            console.error(err)
            return res.render('orders/error')
        }
           

    },
    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
            
            if(!recipe) {
                return res.render('admin/recipes/show', {
                    error: 'Receita não encontrada!'
                }) 
            } 
                

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

            if(!recipe) {
                return res.render('admin/recipes/index', {
                    error: 'Receita não encontrada!'
                }) 
            } 
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
            for(key of keys) {
                if (req.body[key] == "" && key != "information" && key != "removed_files") {

                    return res.render(`/admin/recipes/${req.body.id}/edit`, {
                        error: 'Por favor, preencha todos os campos.'
                    })
                }
            }

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",");
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);
    
                const removedFilesPromise = removedFiles.map(file_id => File.delete(file_id));
    
                await Promise.all(removedFilesPromise);
            }


            if (req.files.length != 0) {

                //validar se ja existe 5 imagens no total
                const oldFiles = await Recipe.files(req.body.id)
                const totalFiles = oldFiles.rows.length + req.files.length

                if(totalFiles <= 6) {
                    const newFilePromises = req.files.map(file => {
                        File.createRecipeFiles({ ...file, recipe_id: req.body.id })
                        })
    
                    await Promise.all(newFilePromises)
                }
            }

                await Recipe.update(req.body)
            
            return res.render("admin/recipes/create", {
                success:'Receita atualizada com sucesso.'
            })

        } catch (error) {
            console.error(error)
        }
            
    },
    async delete(req, res) {
        try {
            const { id } = req.body;

            let results = await Recipe.files(id); //traz todas img da receita

            const filesPromise = results.rows.map(async file => {
                const files = {
                    file_id: file.id,
                    recipe_id: id
                }

                    await RecipeFiles.delete(files)

                    await File.delete(file.id);

                    await Recipe.delete(id);
            });

            Promise.all(filesPromise);

            return res.render('admin/recipes/index', {
                success: 'Receita Deletada com sucesso!.'
            })
            
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}

