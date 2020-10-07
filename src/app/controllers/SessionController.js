const User = require('../models/User')



module.exports = {
    loginForm(req, res) {
        return res.render("session/index")
    },
    login(req, res) {
        

    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    }
}