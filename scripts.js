const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card')

for (let card of cards) {
    card.addEventListener("click", function (){
        const imageId = card.getAttribute('id')
        const pratoId = card.getAttribute ('name')
        const chefId = card.getAttribute ('chef') 
        modalOverlay.classList.add('active')
        modalOverlay.querySelector('img').src = `public/images/${imageId}`
        modalOverlay.querySelector('h3').textContent = `${pratoId}`
        modalOverlay.querySelector('span').textContent = `${chefId}`

    })
}

document.querySelector(".close-modal").addEventListener("click", function () {
    modalOverlay.classList.remove('active')
    modalOverlay.querySelector('img').src = ''
    modalOverlay.querySelector('h3').textContent = ''
    modalOverlay.querySelector('span').textContent = ''
})
