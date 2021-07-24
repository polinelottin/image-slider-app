import source from './source'

const ALLOWED_URL = /^https:.*.jpg$/

function Gallery() {
  const loadedImages = []

  this.images = loadedImages

  this.loadImages = async () => {
    for (const url of source) {
      if (url.match(ALLOWED_URL)) {
        const img = document.createElement('img')

        try {
          img.src = url
          await img.decode()
          loadedImages.push(img)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}

module.exports = Gallery
