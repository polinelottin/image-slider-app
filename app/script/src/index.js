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
  max_height: $canvas.height,
  max_width: $canvas.width,
  width: 800,
  height: 600,
  dx: 0,
  dy: 0,
  readDimensions: function(image) {
    this.width = image.width
    this.height = image.height
    return this
  },
  largestProperty: function () {
    return this.height > this.width ? 'height' : 'width'
  },
  scalingFactor: function(original, computed) {
    return computed / original
  },
  scaleToFit: function() {
    const xFactor = this.scalingFactor(this.width, this.max_width)
    const yFactor = this.scalingFactor(this.height, this.max_height)

    const largestFactor = Math.min(xFactor, yFactor)

    this.width *= largestFactor
    this.height *= largestFactor

    this.dx = this.width < this.max_width ? (this.max_width - this.width) * 0.5 : 0
    this.dy = this.height < this.max_height ? (this.max_height - this.height) * 0.5 : 0
  }
}

const selectAreaAndDraw = () => {
  const image = state.images[state.currentIndex]

  dimensions.readDimensions(image).scaleToFit()

  ctx.clearRect(0, 0, $canvas.width, $canvas.height)
  ctx.drawImage(image, 0, 0, image.width, image.height, dimensions.dx, dimensions.dy, dimensions.width, dimensions.height)
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

const handleCanvasClick = event => {
  event.preventDefault()
  const direction = event.layerX > $canvas.getBoundingClientRect().width * 0.5 ? 1 : -1
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
