const User = require('../models/User')


function checkAllFields(body) {
    //check if has all fields
    const keys = Object.keys(body)
    for (key of keys) { 
       
        if (body[key] == "") {
            return {
               user: body,
               error: 'Por favor, preencha todos os camposS.'
           }
        }
    }
}

async function show(req, res, next) {
    const { userId: id } = req.session
        const user = await User.findOne({
            where: { id }
        })

        if (!user) return res.render("admin/users/show", {
            error: "Usuário nã encontrado!"
        })

    req.user = user    
    
    next()

}

async function post(req, res, next) {
    //check if has all fields
    const fillAllFields = checkAllFields(req.body)
    
    if(fillAllFields) {
        return res.render("admin/users/create", fillAllFields)
    }
    
     //check is user exists [email]
     let { email } = req.body

     const user = await User.findOne({
         where: { email }
         
     })

     if (user) return res.render('admin/users/create', {
         user: req.body,
         error: 'Usuário já cadastrado.'
     })


    next()

}

async function put(req, res, next) {
    //check if has all fields
    const fillAllFields = checkAllFields(req.body)
     if(fillAllFields) {
         return res.render("admin/users/show", fillAllFields)
    }
    
    const user = await User.findOne({where: { id: req.body.id }})


    req.user = user

    next()

}



module.exports = {
    post,
    show,
    put
}