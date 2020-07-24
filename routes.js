const express = require('express')
const routes = express.Router()
const recipes = require('./controllers/recipes')


routes.get('/', function(req, res) {
    return res.redirect("/admin/recipes")
})

routes.get("/admin/recipes", recipes.index)  // Mostrar a Lista de receitas
routes.get("/admin/recipes/create", recipes.create) // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show) // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit) // Mostrar formulário de edição de receita
routes.post("/admin/recipes", recipes.post) // Criar uma nova receita
routes.put("/admin/recipes", recipes.put) // Atualizar uma receita
routes.delete("/admin/recipes", recipes.delete)  // Deletar uma receita


module.exports = routes


