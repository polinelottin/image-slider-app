const sources = [
  'https://i.ibb.co/p4dh2Rr/image.jpg',
  'https://i.ibb.co/jwHDCxy/C1765777-A-12.jpg',
  'https://i.ibb.co/1KYqLFm/2.jpg',
  'https://i.ibb.co/3mbgGmm/3.jpg',
  'https://i.ibb.co/7gSg4XJ/1620162271375.jpg',
  'http://challenge.publitas.com/images/3.jpg',
  'https://github.com/polinelottin.png'
]

const ALLOWED_URL = /^https:.*.jpg$/

function Gallery() {
  const loadedImages = []

  this.images = loadedImages

  this.loadImages = async () => {
    for (const url of sources) {
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
