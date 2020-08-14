const { date } = require('../../lib/utils')
const Chef = require('../models/Chef')


module.exports = {
    index(req, res) {

        Chef.all(function(chefs) {
            return res.render("admin/chefs/index", {chefs})
    
        })

    },
    create(req, res) {

        return res.render("admin/chefs/create")

    },
    post(req, res) {

        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        Chef.create(req.body, function(chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)

        })
    },
    show(req, res) {

        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send("Chef not found")

            chef.chef_id = chef.chef_id 
            chef.name = chef.name
            chef.avatar_url = chef.avatar_url
            chef.create_at = date(chef.create_at).format

            return res.render("admin/chefs/show", { chef })
        })

    },
    edit(req, res) {

        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send("Chef not found")

            return res.render("admin/chefs/edit", { chef })

        })

    },
    put(req, res) {

        return res.render(`admin/chefs/${id}`)
      

    },
    delete(req, res) {


        return res.redirect("/admin/chefs")
    

    },
}
