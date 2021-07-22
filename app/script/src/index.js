import 'babel-polyfill'
import '../vendors'
import './web-settings'
import gallerySource from './gallerySource'

const $canvas = document.getElementById('slider')
const ctx = $canvas.getContext('2d')

const state = {
  currentIndex: 0,
  images: []
}

const selectAreaAndDraw = () => {
  const image = state.images[state.currentIndex]

  const { width, height } = image
  const dHeight = height >= width ? $canvas.height : (height * $canvas.width) / width
  const dWidth = width >= height ? $canvas.width : (width * $canvas.height) / height

  const dx = dWidth === $canvas.width ? 0 : ($canvas.width - dWidth) * 0.5
  const dy = dHeight === $canvas.height ? 0 : ($canvas.height - dHeight) * 0.5

  ctx.clearRect(0, 0, $canvas.width, $canvas.height)
  ctx.drawImage(image, 0, 0, width, height, dx, dy, dWidth, dHeight)
}

const loadImages = async () => {
  for (const source of gallerySource) {
    const allowedImages = /^https:.*.jpg$/

    if (source.match(allowedImages)) {
      var img = document.createElement('img')

      try {
        img.src = source
        await img.decode()
        state.images.push(img)
      } catch (e) {
        console.log(e)
      }
    }
  }
}

const setIndex = direction => {
  const { currentIndex, images } = state
  let newIndex = currentIndex + direction

  if (newIndex === images.length) {
    newIndex = 0
  }

  if (newIndex < 0) {
    newIndex = images.length - 1
  }

  state.currentIndex = newIndex
}

const handleCanvasClick = event => {
  const direction = event.layerX > $canvas.width * 0.5 ? 1 : -1
  setIndex(direction)
  selectAreaAndDraw()
}

const addListeners = () => {
  $canvas.addEventListener('click', handleCanvasClick, false)
}

const start = async () => {
  addListeners()

  await loadImages()

  selectAreaAndDraw()
}

window.onload = function () {
  start()
}
