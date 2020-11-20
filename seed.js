const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')
const RecipeFiles = require('./src/app/models/RecipeFiles')

const { random } = require('faker')
// const { file } = require('./src/app/models/Chef')

let usersIds = []
let totalUsers = 4
let totalRecipes = 20
let totalChefs = 6

async function createUsers() {
    try {
        let users=[]
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
    catch(err) {
        console.error(err)
    }
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

    filesPromise = files.map(file => File.create(file))
    filesResults = await Promise.all(filesPromise)
    filesIds = filesResults.map(result => result.rows[0].id)

    while(chefs.length < totalChefs) {
        chefs.push({
            name: faker.name.firstName(),
        })
    }

    chefsPromises = chefs.map(chef => {
        let file = filesIds[Math.ceil(Math.random() * filesIds.length - 1)]
        fileIndex = filesIds.indexOf(file)
        Chef.create(chef, file)
        filesIds.splice(fileIndex, 1)
    })

    await Promise.all(chefsPromises)
}

async function createRecipes() {
    let recipes = []

    while(recipes.length < totalRecipes) {
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
    const recipesResults = await Promise.all(recipesPromises)
    const recipesIds = recipesResults.map(result => result.rows[0].id) 

    return recipesIds
}

async function createRecipeFiles() {
    let recipesIds = await createRecipes()
    recipesIds = recipesIds.sort((a, b) => a-b)

    let files = []

    for (recipeId of recipesIds) {
        while(files.length < 3) {
            files.push({
                filename: faker.image.image(),
                path: `/public/images/placeholder.png`,
            })
        }
        
        const filesPromises = files.map(file => File.create(file))
        const filesResults = await Promise.all(filesPromises)
        let filesIds = filesResults.map(result => result.rows)


        let ids = []
        for(id of filesIds) {
            ids.push(id[0].id)
        }
        const recipeFilesPromises = ids.map(id => RecipeFiles.create(id, recipeId))

        await Promise.all(recipeFilesPromises)
    }
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
    await createRecipeFiles()
}

init()