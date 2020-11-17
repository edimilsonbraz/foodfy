const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

async function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.redirect("/admin/login")
    
    next()
}

async function onlyAdmin(req, res, next) {
    if (!req.session.isAdmin) {
        return res.redirect('/admin/profile')
    }

    next()
}

function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/admin/users')
    }

    next()
}

async function allowEditRecipe(req, res, next) {
    const { id } = req.params;

    const recipe = await Chef.findRecipesByChefId(id);

    if (req.session.userId == recipe.user_id || req.session.isAdmin) {

        next()

    } else {
        return res.redirect(`/admin/recipes/${recipe.id}`);
    }
}

module.exports = {
    onlyUsers,
    onlyAdmin,
    isLoggedRedirectToUsers,
    allowEditRecipe
}