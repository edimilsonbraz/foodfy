const express = require('express')
const routes = express.Router()

const home = require('../app/controllers/HomeController')


// ROTAS DO FOODFY CLIENTE
routes.get("/home", home.index) 
routes.get("/about", home.about)
routes.get("/search", home.search)
routes.get("/recipesList", home.recipesList)
routes.get("/chefsList", home.chefsList)
routes.get("/recipe/:id", home.recipeDetails)
routes.get("/chef/:id", home.chefDetails)


module.exports = routes