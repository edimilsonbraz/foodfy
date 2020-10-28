const User = require('../models/User')

// Para descriptografar a senha
const { compare } = require('bcryptjs');


module.exports = {
    async show(req, res, next) {
        const { userId: id } = req.session

        const user = await User.findOne({ where: { id } })

        // Se não tiver usuário
        if (!user) {
            return res.render('admin/users/create', {
                error: 'Usuário não encontrado.'
            });
        }

        req.user = user

        next()

    },
    async update(req, res, next) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '') {
                return res.render('admin/profile/index', {
                    user: req.body,
                    error: 'Por favor, preencha todos os campos.'
                })
            }
        }

        const { id, password } = req.body

        if (!password) {
            return res.render('admin/profile/index', {
                user: req.body,
                error: 'Coloque sua senha para atualizar seu cadastro.'
            })
        }

        const user = await User.findOne({ where: { id } })

        // Para descriptografar a senha
        const passed = await compare(password, user.password)

        if (!passed) {
            return res.render('admin/profile/index', {
                user: req.body,
                error: 'Senha incorreta.'
            })
        }

        req.user = user

        next()

    }
}