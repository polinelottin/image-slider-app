import 'babel-polyfill'
import '../vendors'

const Gallery = require('./gallery')
const State = require('./state')
const Canvas = require('./canvas')

const gallery = new Gallery()
const canvas = new Canvas()

const state = new State({
  currentIndex: 0,
  isDragging: false,
  startX: 0,
  currentMouseDistance: 0
})

const $loading = document.getElementById('loading')
const $canvas = document.getElementById('slider')
const BB = $canvas.getBoundingClientRect()
const MIN_TO_SWITCH = BB.width * 0.5

const updateCurrentMouseDistance = currentPosition => {
  const offsetX = BB.left
  const mx = parseInt(currentPosition - offsetX)
  const { startX } = state.current

  state.setState({
    currentMouseDistance: startX - mx
  })
}

const nextIndex = () => {
  const { currentIndex, currentMouseDistance } = state.current
  const images = gallery.images

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

const startDragging = event => {
  state.setState({
    startX: event.layerX,
    isDragging: true
  })
}

const stopDragging = () => {
  state.setState({
    isDragging: false,
    currentMouseDistance: 0
  })
  drawImage()
}

const shouldSwitchImage = () => {
  const { currentMouseDistance } = state.current
  return Math.abs(currentMouseDistance) > MIN_TO_SWITCH
}

const drawImage = () => {
  const { currentIndex, currentMouseDistance } = state.current
  const images = gallery.images

  canvas.drawImage(images[currentIndex], currentMouseDistance)

  if (currentMouseDistance > 0) {
    const nextImage = images[nextIndex()]
    canvas.drawNextImage(nextImage, currentMouseDistance)
  }
  if (currentMouseDistance < 0) {
    const nextImage = images[nextIndex()]
    canvas.drawPreviousImage(nextImage, currentMouseDistance)
  }
}

const handleMove = event => {
  event.preventDefault()
  event.stopPropagation()

  const { isDragging } = state.current

  if (isDragging) {
    updateCurrentMouseDistance(event.clientX)
    drawImage()

    if (shouldSwitchImage()) {
      state.setState({
        currentIndex: nextIndex()
      })

      stopDragging()
      drawImage()
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

  await gallery.loadImages()

  drawImage()
  setLoading(false)
}

window.onload = function () {
  start()
}
