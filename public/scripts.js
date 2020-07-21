const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card')

for (let card of cards) {
    card.addEventListener("click", function (){
        const recipeId = card.getAttribute("id");
        window.location.href = `/recipes/${recipeId}`// Quando clica na receita ele redireciona pra essa url 

    })
    
}
// Função de mostrar e esconder

function showHide(esconder, change) {
    document.querySelector(esconder).classList.toggle('hide')
    
    if(change.textContent == 'ESCONDER') {
      change.innerHTML = 'MOSTRAR'
    } else {
      change.innerHTML = 'ESCONDER'
    }
  }