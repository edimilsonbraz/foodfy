const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card')

for (let card of cards) {
    card.addEventListener("click", function (){
        const recipesId = card.getAttribute("id");
        window.location.href = `/receitas/${recipesId}`

    })
}