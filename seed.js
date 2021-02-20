const faker = require('faker')
const { hash } = require('bcryptjs')
const { random } = require('faker')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')
const RecipeFiles = require('./src/app/models/RecipeFiles')


let usersIds = []
let recipesId = []

let totalUsers = 4
let totalRecipes = 10
let totalChefs = 6


async function createUsers() {
    let users = []
    const password = await hash('1234', 8)

    const trueOrFalse = [true, false]

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            // password,
            seedPassword: password,  //linha nova de teste
            is_admin: trueOrFalse[Math.round(Math.random())]
        })
    }

    const usersPromise = users.map(user => User.create(user))
    usersResults = await Promise.all(usersPromise)
    usersIds = usersResults.map(user => user.id)
    
}

async function createChefs() {
    let files = []
    let chefs = []

    while (files.length < totalChefs) {
        files.push({
            filename: faker.image.image(),
            path: `public/images/chef.png`
        })
    }

    const filesPromise = files.map(file => File.create(file))
    const filesResults = await Promise.all(filesPromise)
    filesIds = filesResults.map(result => result.rows[0].id)

    while (chefs.length < totalChefs) {
        chefs.push({
            name: faker.name.firstName(),
        })
    }

    const chefsPromises = chefs.map(chef => {
        let file = filesIds[Math.ceil(Math.random() * filesIds.length - 1)]
        fileIndex = filesIds.indexOf(file)
        Chef.create(chef, file)
        filesIds.splice(fileIndex, 1)
    })

    await Promise.all(chefsPromises)
}

async function createRecipes() {
    let files = []
    while (files.length < totalRecipes ) {
        files.push({
            filename: faker.image.image(),
            path: `public/images/placeholder.png`,
        })
    }
    //create files 
    const filesPromise = files.map(file => File.create(file))
    const  fileResults= await Promise.all(filesPromise)
    let filesId = fileResults.map(result => result.rows[0].id)

    let recipes = []

    while (recipes.length < totalRecipes) {
        recipes.push({
            chef: Math.ceil(Math.random() * totalChefs),
            title: faker.commerce.productName(),
            ingredients: `{${faker.lorem.lines(5).split(' ')}}`,
            preparation: `{${faker.lorem.lines(5).split(' ')}}`,
            information: faker.lorem.paragraph(),
            userId: Math.ceil(Math.random() * totalUsers)

        })
    }

    const recipesPromises = recipes.map(recipe => Recipe.create(recipe))
    const recipeResults = await Promise.all(recipesPromises)
    let recipesId = recipeResults.map(result => result.rows[0].id) // 10 ids de receitas

       // RecipeFiles
		let recipe_files = []
		
		for (i = 0; i < totalRecipes; i++) {
			recipe_files.push({
                recipe_id: recipesId[i],
                file_id: filesId[i]
            })
		
		}
		
    const recipesFilesPromise = recipe_files.map(recipeFiles => RecipeFiles.create(recipeFiles.recipe_id, recipeFiles.file_id))
    await Promise.all(recipesFilesPromise) 
   
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()