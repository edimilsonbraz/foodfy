const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')


module.exports = {
    async index(req, res) {
        try {
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6
            offset = limit * (page - 1)

        const params = {
            page,
            limit,
            offset
        }

        const chefs = await Chef.paginate(params)

        const pagination = {
            total: Math.ceil(chefs[0].total / limit),
            page
        }

        if (!chefs) return res.send('Chefes não encontrados')

        async function getImage(chefId) {
            let results = await Chef.getAvatar(chefId)

            return results.path
        }

        const chefsPromises = chefs.map(async chef => {
            chef.image = await getImage(chef.id)
            chef.image = `${req.protocol}://${req.headers.host}${chef.image.replace('public', '')}`

            return chef
        })

        const chefAvatar = await Promise.all(chefsPromises)

                return res.render("admin/chefs/index", {chefs: chefAvatar, pagination})

        }catch (err) {j
            console.error (err)
        }

    },
    async create(req, res) {

        return res.render("admin/chefs/create")

    },
    async post(req, res) {
        try {
            if (req.files.length == 0) return res.send('Por favor, insira uma imagem.')

            const filePromise = req.files.map(file => File.create({ ...file }))
            let results = await filePromise[0]
            const fileId = results.rows[0].id

            results = await Chef.create(req.body, fileId)
            const chefId = results.rows[0].id

                return res.redirect(`admin/chefs/${chefId}`)
            } catch (error) {
                console.error(error)
        }
    },
    show(req, res) {

        const { id } = req.params

        Chef.find(req.params.id, function(chef) {
            Chef.chefRecipes(req.params.id, function(recipes) {
                Chef.TotalRecipesByChefs(req.params.id, function(recipesByChef) {
                    
                    return res.render('admin/chefs/show', { chef, recipes, recipesByChef })
            })
        })
    })
            

    },
    edit(req, res) {

        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send("Chef not found")

            return res.render("admin/chefs/edit", { chef })

        })

    },
    update(req, res) {

            const keys = Object.keys(req.body)//CRIA UM OBJETO QUE TEM VARIAS FUNÇÕES//CRIOU UM ARRAY DE CHAVES -> { }
    
            for (key of keys) { 
                if (req.body[key] == "") {
                    return res.send('Please, fill all fields!')
                }
            }
    
           Chef.update(req.body, function() {
               return res.redirect(`/admin/chefs/${req.body.id}`)
            })
    
    },
    delete(req, res) {

        const { id } = req.body

        Chef.TotalRecipesByChefs(id, chef => {
            let { total_recipes } = chef
    
            total_recipes = Number(total_recipes)
    
            if (chef.total_recipes <= 0) {
                Chef.delete(id, () => {
                    return res.redirect('/admin/chefs')
                })
                
            } else {
                return res.send("You cannot delete a chef that has recipes!!")
            }
        
        })

    },
}
