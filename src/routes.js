const express = require('express')
const routes = express.Router()
const recipes = require('./app/controllers/recipes')
const foodfy = require('./app/controllers/foodfy')
const chefs = require('./app/controllers/chefs')




routes.get('/', function(req, res) {

    return res.redirect("/foodfy")
})

routes.get("/foodfy", foodfy.index) 
routes.get("/about", foodfy.about)
routes.get("/recipe", foodfy.recipe)
routes.get("/recipesList", foodfy.recipesList)


routes.get("/admin/recipes", recipes.index)  // Mostrar a Lista de receitas
routes.get("/admin/recipes/create", recipes.create) // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show) // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit) // Mostrar formulário de edição de receita
routes.post("/admin/recipes", recipes.post) // Criar uma nova receita
routes.put("/admin/recipes", recipes.update) // Atualizar uma receita
routes.delete("/admin/recipes", recipes.delete)  // Deletar uma receita


routes.get("/admin/chefs", chefs.index)  // Mostrar a Lista de chefs
routes.get("/admin/chefs/create", chefs.create) // Mostrar formulário de novo chef
routes.get("/admin/chefs/:id", chefs.show) // Exibir detalhes do chefs e suas receitas
routes.get("/admin/chefs/:id/edit", chefs.edit) // Mostrar formulário de edição dos chefs
routes.post("/admin/chefs", chefs.post) // Criar um novo chef
routes.put("/admin/chefs", chefs.update) // Atualizar um chef
routes.delete("/admin/chefs", chefs.delete)  // Deleta um chef


module.exports = routes

