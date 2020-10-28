const express = require('express')
const routes = express.Router()


//Controlers
const ProfileController = require('../app/controllers/ProfileController')

// Controle de sessão
const { onlyUsers } = require('../app/middlewares/session')

//Validators
const ProfileValidator = require('../app/validators/profile')


// Rotas de perfil de um usuário logado
routes.get('/profile', onlyUsers, ProfileValidator.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', onlyUsers, ProfileValidator.update, ProfileController.put)// Editar o usuário logado


module.exports = routes