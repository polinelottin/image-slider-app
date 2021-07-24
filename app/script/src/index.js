import 'babel-polyfill'
import '../vendors'
import { loadImages } from './gallery'
import { state, setState } from './state'

const $loading = document.getElementById('loading')
const $canvas = document.getElementById('slider')
const BB = $canvas.getBoundingClientRect()
var WIDTH = $canvas.width
var HEIGHT = $canvas.height
const MIN_TO_SWITCH = BB.width * 0.5

const INITIAL_STATE = {
  currentIndex: 0,
  images: [],
  isDragging: false,
  startX: 0,
  currentMouseDistance: 0
}

const getContext = () => document.getElementById('slider').getContext('2d')

const updateCurrentMouseDistance = currentPosition => {
  const offsetX = BB.left
  const mx = parseInt(currentPosition - offsetX)

  setState({
    ...state,
    currentMouseDistance: state.startX - mx
  })
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

const nextIndex = () => {
  const { currentIndex, images, currentMouseDistance } = state

  const direction = currentMouseDistance / Math.abs(currentMouseDistance)
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
  const { images, currentIndex, currentMouseDistance } = state
  const image = images[currentIndex]

  dimensions.readDimensions(image).scaleToFit()
  const { dx, dy, dWidth, dHeight } = dimensions

  getContext().clearRect(0, 0, WIDTH, HEIGHT)
  getContext().drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight)

  if (currentMouseDistance !== 0) {
    const nextImage = images[nextIndex()]

    dimensions.readDimensions(nextImage).scaleToFit()
    const dww = WIDTH - currentMouseDistance
    getContext().drawImage(nextImage, 0, 0, nextImage.width, nextImage.height, dww, dy, dWidth, dHeight)
  }
}

const startDragging = event => {
  console.log('stopDragging')
  setState({
    ...state,
    startX: event.layerX,
    isDragging: true
  })
}

const stopDragging = () => {
  console.log('startDragging')
  setState({
    ...state,
    isDragging: false,
    currentMouseDistance: 0
  })
}

const shouldSwitchImage = () => {
  const { currentMouseDistance } = state
  return Math.abs(currentMouseDistance) > MIN_TO_SWITCH
}

const handleMove = event => {
  event.preventDefault()
  event.stopPropagation()

  const { isDragging } = state

  if (isDragging) {
    updateCurrentMouseDistance(event.clientX)
    selectAreaAndDraw()

    if (shouldSwitchImage()) {
      setState({
        ...state,
        currentIndex: nextIndex()
      })

      stopDragging()
      selectAreaAndDraw()
    }
  }
}

const addListeners = () => {
  $canvas.onmousemove = handleMove
  $canvas.ontouchmove = handleMove

  $canvas.onmousedown = startDragging
  $canvas.ontouchstart = startDragging

  $canvas.onmouseup = stopDragging
  $canvas.ontouchend = stopDragging
}

const setLoading = loading => {
  $loading.style.display = loading ? 'block' : 'none'
}

const start = async () => {
  setLoading(true)
  addListeners()
  setState(INITIAL_STATE)

  const images = await loadImages()
  setState({ ...state, images })

  selectAreaAndDraw()
  setLoading(false)
}

window.onload = function () {
  start()
}
