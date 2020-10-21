const User = require('../models/User')

module.exports = {
    async login(req, res, next) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({
                where: { email }
            })

            if (!user) return res.render('session/login', {
                error: 'Usuário não cadastrado!'
            })

            if (password != user.password) return res.render('session/login', {
                user: req.body,
                error: 'Senha incorreta!'
            })

            req.user = user

            next()
        } catch (error) {
            console.error(error)
        }
    },

}

