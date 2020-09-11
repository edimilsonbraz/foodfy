const currentPage = location.pathname
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
  

  const ImagesUpload = {
    input: "",
    preview: document.querySelector('#images-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        ImagesUpload.input = event.target
        
        if (ImagesUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

          ImagesUpload.files.push(file)

          const reader = new FileReader() 

          reader.onload = () => {
              const image = new Image()
              image.src = String(reader.result)

              const div = ImagesUpload.getContainer(image)
              ImagesUpload.preview.appendChild(div)
          }

          reader.readAsDataURL(file)

        })

          ImagesUpload.input.files = ImagesUpload.getAllFiles()

    },
    hasLimit(event) {
      const { uploadLimit, input, preview } = ImagesUpload
      const { files: fileList } = input
      

        if (fileList.length > uploadLimit) {
          alert(`Envie no máximo ${uploadLimit} imagens`)
          event.preventDefault()
          return true;
        }

        const imagesDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "image")
                imagesDiv.push(item)
        })

        const totalPhotos = fileList.length + imagesDiv.length
            if(totalPhotos > uploadLimit) {
                alert("Você atingiu o limite máximo de fotos")
                event.preventDefault()
                return true
            }

        return false
    },
    getAllFiles() {

      const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()  //Cria um array "Files" de imagens no Mozila e Chrome que pode ser manipuladas

      ImagesUpload.files.forEach(file =>  dataTransfer.items.add(file))

      return dataTransfer.files

    },
    getContainer(image) {
      const div = document.createElement('div')
        div.classList.add('image')

        div.onclick = ImagesUpload.removeImage

        div.appendChild(image)

        div.appendChild(ImagesUpload.getRemoveButton()) //inserindo elemento "i"

        return div
    },
    getRemoveButton() {
      const button = document.createElement('i') //adiciona os icones 
      button.classList.add('material-icons')
      button.innerHTML = "close"
      return button
    },
    removeImage(event) {
      const imageDiv = event.target.parentNode  //div class="image"
      const imagesArray = Array.from(ImagesUpload.preview.children)
      const index = imagesArray.indexOf(imageDiv)

        ImagesUpload.files.splice(index, 1)
        ImagesUpload.input.files = ImagesUpload.getAllFiles()

        imageDiv.remove();
    },
    removeOldImage(event) {
      const imageDiv = event.target.parentNode

      if(imageDiv.id) {
          const removedFiles = document.querySelector('input[name="removed_files"')
          if (removedFiles) {
              removedFiles.value += `${imageDiv.id},` //1,2,3,
          }
      }

      imageDiv.remove()
  }
  }