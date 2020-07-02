const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const data = require('./data.js')//array de receitas

server.use(express.static('public'))

server.set("view engine", "njk")

nunjucks.configure("views", {
    express:server,
    autoescape: false,
    noCache: true
})

server.get("/", function(req, res) {
    const index = {
        title: "As melhores receitas",
        description: 'Aprenda a construir os melhores pratos<br> com receitas criadas por profissionais<br> do mundo inteiro',
        image_chef: '/images/chef.png',
        receitas: [
            {image: '/images/burger.png', title: 'Triplo bacon burger', author: 'Jorge Relato' },
           
            {image: '/images/pizza.png', title: 'Pizza 4 estações', author: 'Fabiana Melo'},
            
            {image: '/images/asinhas.png', title: 'Asinhas de frango ao barbecue', author: 'Vania Steroski'},
            
            {image: '/images/lasanha.png', title: "Lasanha mac n' cheese", author: 'Juliano Vieira'},
            
            {image: '/images/espaguete.png', title: 'Espaguete ao alho', author: 'Júlia Kinoto' },
            
            {image: '/images/doce.png', title: 'Docinhos pão-do-céu', author: 'Ricardo Golvea'}
           
        ]
    }
    return res.render("index", {index})
})

server.get("/about", function(req, res) {
    return res.render('about')
})

server.get("/recipesList", function(req, res) {
    return res.render("recipesList", {recipes: data})
})

server.get("/recipe/:index", function (req, res) {
    
    const recipes = data; // Array de receitas carregadas do data.js

    const recipeIndex = req.params.index;

    if (!recipes[recipeIndex]) {
    return res.send("Recipe not found")
}

return res.render("recipe", {recipe: recipes[recipeIndex]})

})

server.listen(5000, function() {
    console.log('server is running')
})