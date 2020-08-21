const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.card')

// for (let card of cards) {
//     card.addEventListener("click", function (){
//         const recipeId = card.getAttribute("id");
//         window.location.href = `/recipes/${recipeId}`// Quando clica na receita ele redireciona pra essa url 

//     })
    
// }

// Função de mostrar e esconder

function showHide(esconder, change) {
    document.querySelector(esconder).classList.toggle('hide')
    
    if(change.textContent == 'ESCONDER') {
      change.innerHTML = 'MOSTRAR'
    } else {
      change.innerHTML = 'ESCONDER'
    }
  }



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



//=====PAGINAÇÃO=====//
      function paginate(selectedPage, totalPages) {

        let pages = [],
        oldPage
    
        for(let currentPage = 1; currentPage <= totalPages; currentPage ++) {
    
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage +2
        const pagesBeforeSelectedPage = currentPage >= selectedPage -2
    
            if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
                if(oldPage && currentPage - oldPage > 2) {
                    pages.push("...")
                }
            
                if (oldPage && currentPage - oldPage == 2) {
                    pages.push(oldPage +1)
                }
                pages.push(currentPage)
            
                oldPage = currentPage
            }
      }
      return pages
    }