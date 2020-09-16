

// LÓGICA PRA ADD PAGINAÇÃO
function createPagination(pagination) {
    
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if(String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else { 
            if(filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`

            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        
        }
    
}

pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
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

//=====ADD CAMPOS DINAMICOS CREATE RECIPES =====//

  //Adiciona Campo Dinâmico ingrediente//
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


//Adiciona Campo Dinâmico preparation//
    function addPreparation() {
      const preparations = document.querySelector("#preparations");
      const fieldContainer = document.querySelectorAll(".preparation");
    
      // Realiza um clone do último ingrediente adicionado
      const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
    
      // Não adiciona um novo input se o último tem um valor vazio
      if (newField.children[0].value == "") return false;
    
      // Deixa o valor do input vazio
      newField.children[0].value = "";
      preparations.appendChild(newField);
    }
    document
      .querySelector(".add-preparation")
      .addEventListener("click", addPreparation);
