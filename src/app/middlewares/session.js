const Recipe = require('../models/Recipe')

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

async function isTheOwner(req, res, next) {
    const results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]
    
    if (req.session.userId !== recipe.user_id){ 

        return res.render("admin/recipes/index", {
                error:'Somente o criador da receita ou Admin pode editar.'
            })
        }

        next()
}


module.exports = {
    onlyUsers,
    onlyAdmin,
    isLoggedRedirectToUsers,
    isTheOwner
}