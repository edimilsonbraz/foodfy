const express = require('express')
const routes = express.Router()


const home = require('./home')
const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const session = require('./session')



routes.get('/', function(req, res) {

    return res.redirect("/home")
})


routes.use('/', home)
routes.use('/admin', recipes)
routes.use('/admin', chefs)
routes.use('/admin', users)
routes.use('/admin', session)



module.exports = routes

