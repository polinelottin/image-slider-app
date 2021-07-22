import 'babel-polyfill'
import '../vendors'
import './web-settings'
import gallerySource from './gallerySource'

const state = {
  currentIndex: 0,
  images: []
}

const selectAreaAndDraw = () => {
  const image = state.images[state.currentIndex]
  const canvas = document.getElementById('slider')
  const ctx = canvas.getContext('2d')

  const { width, height } = image
  const dHeight = height >= width ? canvas.height : (height * canvas.width) / width
  const dWidth = width >= height ? canvas.width : (width * canvas.height) / height

  const dx = dWidth === canvas.width ? 0 : (canvas.width - dWidth) * 0.5
  const dy = dHeight === canvas.height ? 0 : (canvas.height - dHeight) * 0.5

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0, width, height, dx, dy, dWidth, dHeight)
}

const loadImages = async () => {
  for (const source of gallerySource) {
    var img = document.createElement('img')

    img.src = source
    await img.decode()
    state.images.push(img)
  }
}

const handleCanvasClick = event => {
  console.log('click!', event)
}

const addListeners = () => {
  const canvas = document.getElementById('slider')
  canvas.addEventListener('click', handleCanvasClick, false)
}

const start = async () => {
  addListeners()

  await loadImages()

  selectAreaAndDraw()
}

window.onload = function () {
  start()
}
