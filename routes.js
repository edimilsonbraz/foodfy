const express = require('express')
const routes = express.Router()
const recipes = require('./controllers/recipes')



routes.get('/', function(req, res) {
    return res.redirect("/admin/recipes")
})



routes.get("/admin/recipes", function(req, res) {   // Mostrar a Lista de receitas

    return res.render("admin/recipes/index")
})
     
routes.get("/admin/recipes/create", function(req, res) {  // Mostrar formulário de nova receita

    return res.render("admin/recipes/create")
}) 
// routes.get("/admin/recipes/:id", recipes.show) // Exibir detalhes de uma receita
// routes.get("/admin/recipes/:id/edit", recipes.edit) // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.post) 
// routes.get("/admin/recipes", recipes.put) // Editar uma receita
// routes.get("/admin/recipes", recipes.delete)  // Deletar uma receita


module.exports = routes


