const fs = require('fs')
const data = require("../data.json")


exports.post = function(req, res) {

        const keys = Object.keys(req.body)
    
        for(key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        let {image, title, author, ingredients, preparation, information} = req.body


        const id = Number(data.recipes.length + 1)

        data.recipes.push({
            id, 
            image, 
            title, 
            author, 
            ingredients, 
            preparation, 
            information
        })

    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) { 
            //esse metodo grava e gera um arquivo JSON
            if (err) return res.send("Write file error!") 
    
            return res.redirect("/admin/recipes")// ao termino do salvamento redireciona pra essa pg
        })
    

        // return res.send(req.body)

}