/* FUNCINALIDADE FOTOS */
const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  files: [],

  handleFileInput(event) {
      const { files: fileList } = event.target
      PhotosUpload.input = event.target

      if(PhotosUpload.hasLimit(event)) return
      

      Array.from(fileList).forEach(file => {

          PhotosUpload.files.push(file)

          const reader = new FileReader()

          reader.onload = () => {
              const image = new Image() //<img>
              image.src = String(reader.result)

              const div = PhotosUpload.getContainer(image)
              PhotosUpload.preview.appendChild(div)

          }

          reader.readAsDataURL(file)

      })
      
          PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event) {
      const { uploadLimit, input, preview } = PhotosUpload
      const { files: fileList } = input
      

      if(fileList.length > uploadLimit) {
          alert(`Envie no máximo ${uploadLimit} fotos`)
          event.preventDefault()
          return true
      }

      const photosDiv = []
      preview.childNodes.forEach(item => {
          if(item.classList && item.classList.value == "photo")
              photosDiv.push(item)
      })

      const totalPhotos = fileList.length + photosDiv.length
          if(totalPhotos > uploadLimit) {
              alert("Você atingiu o limite máximo de fotos(5)")
              event.preventDefault()
              return true
          }

      return false
  },
  getAllFiles() {
      const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

      PhotosUpload.files.forEach(file =>  dataTransfer.items.add(file))

      return dataTransfer.files
  },
  getContainer(image) {
      const div = document.createElement('div')
          div.classList.add('photo')

          div.onclick = PhotosUpload.removePhoto

          div.appendChild(image)

          div.appendChild(PhotosUpload.getRemoveButton())

          return div
  },
  getRemoveButton() {
      const button = document.createElement('i')
      button.classList.add('material-icons')
      button.innerHTML = "delete"
      return button
  },
  removePhoto(event) {
      const photoDiv = event.target.parentNode //div class="photo"
      const photosArray = Array.from(PhotosUpload.preview.children)
      const index = photosArray.indexOf(photoDiv)

      PhotosUpload.files.splice(index, 1) //splice aplica no array pra tirar uma posição do array
      PhotosUpload.input.files = PhotosUpload.getAllFiles()

      photoDiv.remove()

  },
  removeOldPhoto(event) {
      const photoDiv = event.target.parentNode

      if(photoDiv.id) {
          const removedFiles = document.querySelector('input[name="removed_files"')
          if (removedFiles) {
              removedFiles.value += `${photoDiv.id},` //1,2,3,
          }
      }

      photoDiv.remove()
  }

}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'), //pega toda a lista de imagens
  setImage(e) {
      const { target } = e

      ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
      target.classList.add('active')

      ImageGallery.highlight.src = target.src
      lightbox.image.src = target.src
  }
}

const lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
      lightbox.target.style.opacity = 1
      lightbox.target.style.top = 0
      lightbox.target.style.button = 0
      lightbox.closeButton.style.top = 0
  },
  close() {
      lightbox.target.style.opacity = 0
      lightbox.target.style.top = "-100%"
      lightbox.target.style.button = "initial"
      lightbox.closeButton.style.top = "-80px"

  }
}