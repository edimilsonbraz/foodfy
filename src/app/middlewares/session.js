const User = require('../models/User')

async function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.redirect("/admin/login")

    next()
}

async function onlyAdmins(req, res, next) {
    const { userId: id } = req.session
    
    const user = await User.findOne({ Where: { id } })

    const users = await User.list()

    if (user.is_admin != true) {
        return res.redirect('admin/users', {
            users,
            error: "Apenas Adminitradores podem efetuar essas operações!"
        })
    }
    
    next()
}

function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/admin/users')
    }

    next();
}

async function allowEditRecipe(req, res, next) {
    const { id } = req.params;

    const recipe = await Recipe.findRecipeWithChef(id);

    if (req.session.userId == recipe.user_id || req.session.isAdmin) {
        next();
    } else {
        return res.redirect(`/admin/recipes/${recipe.id}`);
    }
}

module.exports = {
    onlyUsers,
    onlyAdmins,
    isLoggedRedirectToUsers,
    allowEditRecipe
}