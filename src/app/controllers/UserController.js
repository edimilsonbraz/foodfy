const User = require('../models/User')


module.exports = {
    async list(req, res) {
        try {
            let results = await User.all();
            const users = results.rows

            return res.render("admin/users/index", { users })

        }catch(err) {
            console.error(err)
        }
    },
    async create(req, res) {

        return res.render("admin/users/create")

    },
    async post(req, res) {
        const userId = await User.create(req.body)

        req.session.userId = userId
       
        return res.redirect('/admin/users') 
    },
    async show(req, res) {
        try {
            const { user } = req

        }catch(err) {
            console.error(err)
        }
        return res.render("Ok, cadastrado!")
    },
}