const User = require('../models/User')

module.exports = {
    async index(req, res) {
        try {
            const { user } = req

            return res.render('admin/profile/index', { user })
            
        }catch(err) {
            console.error(err)
        }

    },
    async put(req, res) {
        try {
            const { user } = req;
            let { name, email } = req.body

            await User.put(user.id, {
                name,
                email
            })

            return res.render('admin/profile/index', {
                user: req.body,
                success: 'Conta atualizada com sucesso.'
            })

        } catch (error) {
            console.error(error);

            return res.render('admin/profile/index', {
                user,
                error: 'Algum erro aconteceu.'
            })
        }
    }
}