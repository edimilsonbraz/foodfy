const express = require('express')
const routes = express.Router()

const chefs = require('../app/controllers/chefsController')
const multer = require('../app/middlewares/multer')

// ROTAS AREA ADMIN CHEF
routes.get("/chefs", chefs.index)  // Mostrar a Lista de chefs
routes.get("/chefs/create", chefs.create) // Mostrar formulário de novo chef
routes.get("/chefs/:id", chefs.show) // Exibir detalhes do chefs e suas receitas
routes.get("/chefs/:id/edit", chefs.edit) // Mostrar formulário de edição dos chefs
routes.post("/chefs", multer.single("image"), chefs.post) // Criar um novo chef
routes.put("/chefs", multer.single("image"), chefs.update) // Atualizar um chef
routes.delete("/chefs", chefs.delete)  // Deleta um chef



module.exports = routes