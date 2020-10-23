const User = require('../models/User')
const { hash } = require('bcryptjs');
const crypto = require('crypto')
const mailer = require('../../lib/mailer');


module.exports = {
    async list(req, res) {
        try {
            const users = await User.list()
            
            return res.render("admin/users/index", { users })

        }catch(err) {
            console.error(err)
        }
    },
    async create(req, res) {

        return res.render("admin/users/create")

    },
    async post(req, res) {
        try {
            let { email, is_admin } = req.body
    
            //um token para esse usuário
            const token = crypto.randomBytes(20).toString('hex')
    
            const randomPassword = crypto.randomBytes(4).toString("hex")
            req.body.password = randomPassword
    
            const userId = await User.create(req.body)
            req.session.userId = userId
            const { userId: id } = req.session
    
            //criar uma expiração
            let now = new Date();
            now = now.setHours(now.getHours() + 48)
    
            await User.put(id, {
                reset_token: token,
                reset_token_expires: now
            })
    
            //enviar um email com um link da senha
            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Cadastro com sucesso! Altere sua senha pré definida!',
                html: `<h2>Criamos um senha pré definida para sua entrada no sistema, e estamos enviando este email para que você atualizar como preferir!!!</h2>
                <h3>Sua senha é: ${randomPassword}</h3>
                <p>Clique no link abaixo para alterá-la!</p>
                <p>
                    <a href="http://localhost:3000/admin/reset-password?token=${token}" target="_blank">
                    NOVA SENHA
                    </a>
                    <p>Este email com o link de alteração de senha é válido apenas para as próximas 48 horas.</p>
                </p>
                `
            })
    
            if (is_admin != 'true') {
                is_admin = false
            }
    
            const users = await User.list()
    
            //avisar o usuário que enviamos o email
            return res.render('admin/users/index', { 
                users,
                success: "Usuário cadastrado com sucesso! Confire o e-mail cadastrado!"
            })
            
        }catch(err) {
            console.error(err)
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params
    
            const user = await User.findOne({ Where: { id } })
            
            return res.render('admin/users/edit', { user })

        }catch(err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            let { id, name, email, is_admin } = req.body

            if (is_admin != 'true') {
                is_admin = false
            }

            const user = await User.put(id, {
                name,
                email,
                is_admin
            })

            const users = await User.list()

            return res.render('admin/users/index', {
                users,
                success: "Usuário atualizada com sucesso!"
            })

        } catch (err) {
            console.error(err)
            return res.render('admin/users/index', {
                users,
                error: 'Erro ao atualizar o usuário!'
            })
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.body;

            await User.delete(id);
    
            return res.render('admin/users/index', {
                success: "Usuário deletado com sucesso!"
            })

        }catch(err) {
            console.error(err)
        }
    }
    
}