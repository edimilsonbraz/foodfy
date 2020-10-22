const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    loginForm(req, res) {
        return res.render("admin/session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect("admin/users")

    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },
    forgotPasswordToForm(req, res) {
        return res.render('admin/session/forgot-password')
    },
    async forgotPassword(req, res) {
        let { email, is_admin } = req.body

        //um token para esse usuário
        const token = crypto.randomBytes(20).toString('hex')

        const randomPassword = crypto.randomBytes(4).toString("hex")
        req.body.password = randomPassword

        const userId = await User.create(req.body)
        req.session.userId = userId
        const { userId: id } = req.session

        //criar um expiração
        let now = new Date();
        now = now.setHours(now.getHours() + 48)

        await User.update(id, {
            reset_token: token,
            reset_token_expires: now
        })

        //enviar um email com um link de recuperação de senha

        //avisar o usuário que enviamos o email


        return res.render('admin/session/forgot-password')
    }
}