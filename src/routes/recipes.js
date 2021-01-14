const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/RecipeController')

// Controle de sessão
const { onlyUsers, isTheOwner } = require('../app/middlewares/session')

// ROTAS AREA ADMIN RECEITASreq.session.userId
routes.get("/recipes", onlyUsers, recipes.index)  // Mostrar a Lista de receitas
routes.get("/recipes/create", onlyUsers, recipes.create) // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyUsers, recipes.show) // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyUsers, isTheOwner, recipes.edit) // Mostrar formulário de edição de receita
routes.post("/recipes", onlyUsers, multer.array("photos", 5), recipes.post) // Criar uma nova receita
routes.put("/recipes", onlyUsers, multer.array("photos", 5), recipes.update) // Atualizar uma receita
routes.delete("/recipes", onlyUsers, recipes.delete)  // Deletar uma receita



module.exports = routes