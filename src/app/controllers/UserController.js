const User = require('../models/User')


module.exports = {
    registerForm(req, res) {
        return res.render("user/register")
    },
    show(req, res) {
        return res.render("Ok, cadastrado!")
    },
    async post(req, res) {

    }
}