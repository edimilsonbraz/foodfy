const express = require('express')
const routes = express.Router()

// Importa as rotas
const home = require('./home')
const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const session = require('./session')
const profile = require('./profile')


//Alias
routes.get('/', function(req, res) {
    return res.redirect("/home")
})

// Usa as rotas
routes.use('/', home)
routes.use('/admin', recipes)
routes.use('/admin', chefs)
routes.use('/admin', users)
routes.use('/admin', session)
routes.use('/admin', profile)



module.exports = routes


