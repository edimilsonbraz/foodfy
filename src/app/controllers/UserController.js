const User = require('../models/User')
const { hash } = require('bcryptjs');


module.exports = {
    async list(req, res) {
        try {
            let results = await User.list()
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
        const { user } = req

        return res.render('admin/users/show', {
            user,
            // success: "Conta atualizada com sucesso!"
        })
    },
    async put(req, res) {
        try {
            const { user } = req
            const { name, email, is_admin } = req.body

            if (is_admin != 'true') {
                is_admin = false
            }

            await User.put(user.id, {
                name,
                email,
                is_admin
            })

            return res.redirect('/admin/users/show', {
                user: req.body,
                success: "Usuário atualizada com sucesso!"
            })

        } catch (error) {
            console.error(error)
            return res.render('admin/users/show', {
                user: req.body,
                error: 'Erro ao atualizar o usuário!'
            })
        }
    },
    
}