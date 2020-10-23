const User = require('../models/User')
const { compare } = require('bcryptjs');

module.exports = {
    async login(req, res, next) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({
                where: { email }
            })

            if (!user) return res.render('admin/session/login', {
                user: req.body,
                error: 'Usuário não cadastrado!'
            })

            const passed = await compare(password, user.password)

            if (!passed) 
                return res.render('admin/session/login', {
                    user: req.body,
                    error: 'Senha incorreta!'
            })

            req.user = user

            next()

        } catch (error) {
            console.error(error)
        }
    },
    async forgotPassword(req, res, next) {
        const { email } = req.body

        try {
            let user = await User.findOne({ where: { email }})

            if (!user) {
                return res.render("admin/session/forgot-password", {
                    user: req.body,
                    error: "Email não cadastrado!"
                })
            }

            req.user = user

            next()

        } catch(err) {
            console.error(err);
        }
    },
    async resetPassword(req, res, next) {
        const { email, password, passwordRepeat, token } = req.body;

        const user = await User.findOne({ Where: { email }});

        if (!user) {
            return res.render("admin/session/reset-password", {
                user: req.body,
                token,
                error: "Email não cadastrado!"
            })
        }

        if (password != passwordRepeat) {
            return res.render("admin/session/forgot-password", {
                user: req.body,
                token,
                error: "Preencha as senhas da mesma maneira!"
            })
        }

        if (token != user.reset_token) {
            return res.render("admin/session/forgot-password", {
                user: req.body,
                token,
                error: "Token inválido! Solicite uma nova recuperação de senha."
            })
        }

        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) {
            return res.render('admin/session/reset-password', {
                user: req.body, 
                token,
                error: 'Token expirado! Solicite uma nova recuperação de senha.'
            })
        }

        req.user = user

       next()
    }


}

