const User = require('../models/User')

module.exports = {
    async post(req, res, next) {
        try {
            //check if has all fields
            const keys = Object.keys(req.body);
            for(const key of keys) {
                if (req.body[key] == "" && key != "is_admin" && key != "id") {
                    return res.render('admin/users/create', {
                        user: req.body,
                        error: "Preencha todos os campos!"
                    });
                }
            }

            //check is user exists [email,name]
            let { name, email } = req.body

            const user = await User.findOne({
                where: { email },
                or: { name }

            })

            if (user) {
                return res.render('admin/users/create', {
                    user: req.body,
                    error: 'Usuário já cadastrado.'
                })
            }

            next()

        } catch (err) {
            console.error(err)
        }
    },
    async put(req, res, next) {
        try {
            //check if has all fields
            const keys = Object.keys(req.body);
            for(const key of keys) {
                if (req.body[key] == "" && key != "is_admin" && key != "id") {
                    return res.render('admin/users/edit', {
                        user: req.body,
                        error: "Preencha todos os campos!"
                    });
                }
            }

            const user = await User.findOne({ where: { id: req.body.id } })
            req.user = user

            next()

        } catch (err) {
            console.error(err)
        }
    },
    async delete(req, res, next) {
        try {
            //verificar se o usuário está tentando deletar sua conta
            const { userId: id } = req.session

            const deleteUser = req.body.id
            // console.log(deleteUser)

            const users = await User.list()

            if (id == deleteUser) {
                return res.render('admin/users/index', {
                    users,
                    error: 'Você não pode deletar sua própria conta!'
                })
            }

            next()

        } catch (err) {
            console.error(err)
        }
    }
}