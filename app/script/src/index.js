import 'babel-polyfill'
import '../vendors'
import './web-settings'
import gallerySource from './gallerySource'

const $sliderContainer = document.getElementById('slider_container')
const $canvas = document.getElementById('slider')
const ctx = $canvas.getContext('2d')

const state = {
  currentIndex: 0,
  images: []
}

const dimensions = {
  max_height: $sliderContainer.getBoundingClientRect().height,
  max_width: $sliderContainer.getBoundingClientRect().width,
  width: 600,
  height: 400,
  readDimensions: function(image) {
    this.width = image.width
    this.height = image.height
    return this
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
  }
}

const selectAreaAndDraw = () => {
  const image = state.images[state.currentIndex]

  dimensions.readDimensions(image).scaleToFit()

  $canvas.width = dimensions.width
  $canvas.height = dimensions.height

  ctx.clearRect(0, 0, $canvas.getBoundingClientRect().width, $canvas.getBoundingClientRect().height)
  ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height)
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
