const express = require('express')
const routes = express.Router()

const { onlyAdmins } = require('../app/middlewares/session')

const UserController = require('../app/controllers/UserController')
// const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/user')


// Rotas de perfil de um usuário logado
// routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', UserController.list) //Mostrar a lista de usuários cadastrados
routes.get("/users/create", UserController.create) // Mostrar formulário de novo usuário
routes.get('/users/:id/edit',onlyAdmins, UserController.edit) // Mostar um user em edição

routes.post('/users', UserValidator.post, UserController.post) //Criar um usuário
routes.put('/users', UserValidator.put, UserController.put) // Editar um usuário
routes.delete('/users', onlyAdmins, UserValidator.delete, UserController.delete) // Deletar um usuário


module.exports = routes