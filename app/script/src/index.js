import 'babel-polyfill'
import '../vendors'
import './web-settings'
import gallerySource from './gallerySource'

const $canvas = document.getElementById('slider')
const BB = $canvas.getBoundingClientRect()
var WIDTH = $canvas.width
var HEIGHT = $canvas.height
const MIN_TO_SWITCH = BB.width * 0.5

const getContext = () => document.getElementById('slider').getContext('2d')

const state = {
  currentIndex: 0,
  images: [],
  isDragging: false,
  startX: 0,
  currentMouseDistance: 0
}

const updateCurrentMouseDistance = currentPosition => {
  const offsetX = BB.left
  const mx = parseInt(currentPosition - offsetX)
  state.currentMouseDistance = state.startX - mx
}

const dimensions = {
  maxHeight: HEIGHT,
  maxWidth: WIDTH,
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

    this.dx = this.imageMargin(this.maxWidth, this.dWidth) - state.currentMouseDistance
    this.dy = this.imageMargin(this.maxHeight, this.dHeight)
  }
}

const getNextIndex = direction => {
  const { currentIndex, images } = state
  let newIndex = currentIndex + direction

  if (newIndex === images.length) {
    return 0
  }

  if (newIndex < 0) {
    return images.length - 1
  }

  return newIndex
}

const selectAreaAndDraw = () => {
  getContext().clearRect(0, 0, WIDTH, HEIGHT)

  const image = state.images[state.currentIndex]
  dimensions.readDimensions(image).scaleToFit()

  const { dx, dy, dWidth, dHeight } = dimensions
  getContext().drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight)

  if (state.currentMouseDistance !== 0) {
    const nextIndex = getNextIndex(state.currentMouseDistance / Math.abs(state.currentMouseDistance))
    const nextImage = state.images[nextIndex]

    dimensions.readDimensions(nextImage).scaleToFit()
    const dww = WIDTH - state.currentMouseDistance
    getContext().drawImage(nextImage, 0, 0, nextImage.width, nextImage.height, dww, dy, dWidth, dHeight)
  }
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

const handleMove = event => {
  event.preventDefault()
  event.stopPropagation()

  if (!state.isDragging) return

  updateCurrentMouseDistance(event.clientX)
  selectAreaAndDraw()

  if (Math.abs(state.currentMouseDistance) > MIN_TO_SWITCH) {
    state.currentIndex = getNextIndex(state.currentMouseDistance / Math.abs(state.currentMouseDistance))
    stopDrag()
    selectAreaAndDraw()
  }
}

const startDrag = event => {
  state.startX = event.layerX
  state.isDragging = true
}

const stopDrag = () => {
  state.isDragging = false
  state.currentMouseDistance = 0
}

const addListeners = () => {
  $canvas.onmousemove = handleMove
  $canvas.ontouchmove = handleMove
  $canvas.onmousedown = startDrag
  $canvas.ontouchstart = startDrag
  $canvas.onmouseup = stopDrag
  $canvas.ontouchend = stopDrag
}

const start = async () => {
  addListeners()

  await loadImages()

  selectAreaAndDraw()
}

window.onload = function () {
  start()
}
