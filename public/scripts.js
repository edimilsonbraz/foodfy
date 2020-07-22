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

  //Adiciona Campo Dinâmico
  function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  }
  
  document
    .querySelector(".add-ingredient")
    .addEventListener("click", addIngredient);