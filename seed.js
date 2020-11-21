const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')
const RecipeFiles = require('./src/app/models/RecipeFiles')

const { random } = require('faker')

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
            password,
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
            path: `https://source.unsplash.com/collection/2013520/640x480`,
        })
    }
    //create files 
    const filesPromise = files.map(file => File.create(file))
    const filesId = await Promise.all(filesPromise)


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
    const recipesId = await Promise.all(recipesPromises)
    

       // RecipeFiles
		let recipe_files = []
		
		for (id = 0; id < totalRecipes; id++) {
			recipe_files.push({
                recipe_id: recipesId[id],
                file_id: filesId[id]
            })
		
		}
		
		const recipesFilesPromise = recipe_files.map(recipeFiles => RecipeFiles.create(recipeFiles))
		await Promise.all(recipesFilesPromise) 
   
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
    // await createRecipeFiles()
}

init()