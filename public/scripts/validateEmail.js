const Validate = {
    apply(input, func) {
        Validate.clearErros(input)//chama a função que limpa o input

        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error)
        Validate.displayError(input, results.error)

           
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()

    },
    clearErros(input) { //limpa o input
        const errorDiv = input.parentNode.querySelector(".error")
        if (errorDiv)
            errorDiv.remove()
    },
    isEmail(value) {
        let error = null
        
        //abcdbc@abcabc.com.br
        const mailFormat = /^\w+([\.-]?\w+)*@\w([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat))
            error = "Email inválido!"

        return {
            error,
            value
        }
    },
    
}

  

