const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/recipesController')

const { onlyUsers, allowEditRecipe } = require('../app/middlewares/session')

// ROTAS AREA ADMIN RECEITAS
routes.get("/recipes", onlyUsers, recipes.index)  // Mostrar a Lista de receitas
routes.get("/recipes/create", onlyUsers, recipes.create) // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyUsers, recipes.show) // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyUsers, allowEditRecipe, recipes.edit) // Mostrar formulário de edição de receita
routes.post("/recipes", onlyUsers, multer.array("image", 5), recipes.post) // Criar uma nova receita
routes.put("/recipes", onlyUsers, multer.array("image", 5), recipes.update) // Atualizar uma receita
routes.delete("/recipes", onlyUsers, recipes.delete)  // Deletar uma receita



module.exports = routes