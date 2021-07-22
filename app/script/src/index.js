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

const dimensions = {
  maxHeight: $canvas.height,
  maxWidth: $canvas.width,
  dWidth: 800,
  dHeight: 600,
  dx: 0,
  dy: 0,
  readDimensions: function(image) {
    this.dWidth = image.width
    this.dHeight = image.height
    return this
  },
  largestProperty: function () {
    return this.dHeight > this.dWidth ? 'height' : 'width'
  },
  scalingFactor: function(original, computed) {
    return computed / original
  },
  imageMargin: function(maxSize, imageSize) {
    return imageSize < maxSize ? (maxSize - imageSize) * 0.5 : 0
  },
  scaleToFit: function() {
    const xFactor = this.scalingFactor(this.dWidth, this.maxWidth)
    const yFactor = this.scalingFactor(this.dHeight, this.maxHeight)

    const largestFactor = Math.min(xFactor, yFactor)

    this.dWidth *= largestFactor
    this.dHeight *= largestFactor

    this.dx = this.imageMargin(this.maxWidth, this.dWidth)
    this.dy = this.imageMargin(this.maxHeight, this.dHeight)
  }
}

const selectAreaAndDraw = () => {
  const image = state.images[state.currentIndex]
  dimensions.readDimensions(image).scaleToFit()

  ctx.clearRect(0, 0, $canvas.width, $canvas.height)

  const { dx, dy, dWidth, dHeight } = dimensions
  ctx.drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight)
}

const loadImages = async () => {
  for (const source of gallerySource) {
    const allowedImages = /^https:.*.jpg$/

    if (source.match(allowedImages)) {
      const img = document.createElement('img')

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

const clickedOnRightSide = (layerX) => (
  layerX > ($canvas.getBoundingClientRect().width * 0.5)
)

const handleCanvasClick = event => {
  event.preventDefault()

  const direction = clickedOnRightSide(event.layerX) ? 1 : -1

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
