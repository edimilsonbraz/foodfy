const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    loginForm(req, res) {
        return res.render("admin/session/login")
    },
    login(req, res) {
        //user comum
        req.session.userId = req.user.id

        //user admin
        req.session.is_admin = req.user.is_admin

        if(req.user.is_admin) {
            return res.render("admin/users/index")
        }else {
            return res.redirect('/home')
        }

    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },
    forgotPasswordToForm(req, res) {
        return res.render('admin/session/forgot-password')
    },
    async forgotPassword(req, res) {
        try {

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
    
            await User.put(id, {
                reset_token: token,
                reset_token_expires: now
            })
    
            //enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                    html: `<h2>Esqueceu da Senha?</h2>
                    <p>Não se preocupe, clique no link abaixo para recuperar!</p>
                    <p>
                        <a href="http://localhost:3000/admin/reset-password?token=${token}" target="_blank">
                        RECUPERAR SENHA
                        </a>
                    </p>
                    `
            })
    
            //avisar o usuário que enviamos o email
            return res.render("admin/session/forgot-password", {
                success: "Verifique seu email para resetar sua senha!"
            })
        }catch(err) {
            console.error(err)

            return res.render("admin/session/forgot-password", {
                error: "Um erro ocorreu, tente novamente!"
            })

        }

    },
    resetPasswordToForm(req, res) {
        return res.render('admin/session/reset-password', { token: req.query.token });
    },
    async resetPassword(req, res) {
        const user = req.user
        const { password, token } = req.body

        try {
            //cria um nov hash de senha
            const newPassowrd = await hash(password, 8);

            //Atualiza o usuário
            await User.put(user.id, {
                password: newPassowrd,
                reset_token: "",
                reset_token_expires: ""
            })

            //Avisa o usuário que ele tem uma nova senha!
            return res.render("admin/session/login", {
                user: req.body,
                success: "Senha atualizada! Faça seu login!"
            })
        } catch (err) {
            console.error(err)
            
            return res.render("admin/session/reset-password", {
                user: req.body,
                token,
                error: "Um erro ocorreu, tente novamente!"
            })
        }
    }
}