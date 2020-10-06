const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/recipesController')

// ROTAS AREA ADMIN RECEITAS
routes.get("/recipes", recipes.index)  // Mostrar a Lista de receitas
routes.get("/recipes/create", recipes.create) // Mostrar formulário de nova receita
routes.get("/recipes/:id", recipes.show) // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", recipes.edit) // Mostrar formulário de edição de receita
routes.post("/recipes", multer.array("image", 5), recipes.post) // Criar uma nova receita
routes.put("/recipes", multer.array("image", 5), recipes.update) // Atualizar uma receita
routes.delete("/recipes", recipes.delete)  // Deletar uma receita



module.exports = routes