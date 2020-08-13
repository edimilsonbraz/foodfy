// const modalOverlay = document.querySelector('.modal-overlay')
// const cards = document.querySelectorAll('.card')

// for (let card of cards) {
//     card.addEventListener("click", function (){
//         const recipeId = card.getAttribute("id");
//         window.location.href = `admin/recipes/${recipeId}`// Quando clica na receita ele redireciona pra essa url 

//     })
    
// }

// function showHide(esconder, change) {
//     document.querySelector(esconder).classList.toggle('hide')
    
//     if(change.textContent == 'ESCONDER') {
//       change.innerHTML = 'MOSTRAR'
//     } else {
//       change.innerHTML = 'ESCONDER'
//     }
//   }

module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`

        }
    }
}