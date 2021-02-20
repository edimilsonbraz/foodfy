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
            console.error(err), {
                error: "Area de administradores, Talvez vc não tenha permissão!"
            }
        }
    },
    async create(req, res) {

        return res.render("admin/users/create")

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
    async post(req, res) {
        try {
            const {id, email, password, is_admin} = await User.create(req.body)

            const user = await User.findOne({ where: {id} })
    
            //enviar um email com um link da senha
            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Cadastro com sucesso! Altere sua senha pré definida!',
                html: `
                <h2>Seja bem vindo ao Foodfy, ${user.name}</h2>

                <p>Sua conta foi criada com sucesso, e a partir de agora poderá desfrutar
                dos segredos de nossas deliciosas receitas!
                </p>
                <br>

                <p>Aqui estão seus dados de acesso à plataforma:</p>
                <p>Usuário: ${email}</p>
                <p>Senha: ${password}</p>
                <br>

                <p> Lembre-se de que pode alterar sua senha a qualquer momento dentro da plataforma.<p>

                `
            })
    
            const users = await User.list()
    
            //avisar o usuário que enviamos o email
            return res.render('admin/users/index', { 
                users,
                success: "Usuário cadastrado com sucesso! Confira o e-mail cadastrado!"
            })
            
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

            return res.render('admin/users/index', {
                user: req.body,
                error: 'Erro ao tentar deletar sua conta.'
            })
        }
    }
    
}