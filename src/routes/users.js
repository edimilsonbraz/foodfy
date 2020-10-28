const express = require('express')
const routes = express.Router()


//Controlers
const UserController = require('../app/controllers/UserController')

// Controle de sessão
const { onlyAdmin } = require('../app/middlewares/session')

//Validators
const UserValidator = require('../app/validators/user')


// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
routes.get("/users/create", onlyAdmin, UserController.create) // Mostrar formulário de novo usuário
routes.get('/users/:id/edit',onlyAdmin, UserController.edit) // Mostar um user em edição

routes.post('/users', onlyAdmin, UserValidator.post, UserController.post) //Criar um usuário
routes.put('/users', onlyAdmin, UserValidator.put, UserController.put) // Editar um usuário
routes.delete('/users', onlyAdmin, UserValidator.delete, UserController.delete) // Deletar um usuário


module.exports = routes