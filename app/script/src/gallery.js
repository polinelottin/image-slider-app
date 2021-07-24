const sources = [
  'https://i.ibb.co/p4dh2Rr/image.jpg',
  'https://i.ibb.co/jwHDCxy/C1765777-A-12.jpg',
  'https://i.ibb.co/1KYqLFm/2.jpg',
  'https://i.ibb.co/3mbgGmm/3.jpg',
  'https://i.ibb.co/7gSg4XJ/1620162271375.jpg',
  'http://challenge.publitas.com/images/3.jpg',
  'https://github.com/polinelottin.png'
]

const ALLOWED_IMAGES = /^https:.*.jpg$/

const loadImages = async () => {
  const images = []
  for (const source of sources) {
    if (source.match(ALLOWED_IMAGES)) {
      const img = document.createElement('img')

      try {
        img.src = source
        await img.decode()
        images.push(img)
      } catch (e) {
        console.log(e)
      }
    }
  }
  return images
}

export { loadImages }
