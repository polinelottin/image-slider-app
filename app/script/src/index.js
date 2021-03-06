import 'babel-polyfill'
import '../vendors'

const Gallery = require('./gallery')
const State = require('./state')
const Canvas = require('./canvas')

const state = new State({
  index: 0,
  startX: 0,
  mouseDistance: 0,
  isDragging: false
})

const $loading = document.getElementById('loading')
const $canvas = document.getElementById('slider')
const BB = $canvas.getBoundingClientRect()
const MIN_TO_SWITCH = BB.width * 0.2

const gallery = new Gallery()
const canvas = new Canvas($canvas)

const updateMouseDistance = currentPosition => {
  const offsetX = BB.left
  const mx = parseInt(currentPosition - offsetX)
  const { startX } = state.current

  state.setState({
    mouseDistance: startX - mx
  })
}

const slideDirection = () => {
  const { mouseDistance } = state.current
  return mouseDistance / Math.abs(mouseDistance)
}

const nextIndex = () => {
  const { index, mouseDistance } = state.current

  if (mouseDistance === 0) return index

  const totalImages = gallery.images.length

  let newIndex = index + slideDirection()

  if (newIndex >= totalImages) {
    return 0
  }

  if (newIndex < 0) {
    return totalImages - 1
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
    mouseDistance: 0
  })
  drawImage()
}

const shouldSwitchImage = () => {
  const { mouseDistance } = state.current
  return Math.abs(mouseDistance) > MIN_TO_SWITCH
}

const drawImage = () => {
  const { index, mouseDistance } = state.current
  const images = gallery.images

  canvas.drawMainImage(images[index], mouseDistance)
  canvas.drawNextImage(images[nextIndex()], mouseDistance)
}

const animateTransition = () => {
  const { mouseDistance } = state.current
  const direction = slideDirection()

  let counter = 0
  const timer = setInterval(() => {
    counter++
    const increment = (10 * counter) * direction
    const newDistance = mouseDistance + increment

    state.setState({ mouseDistance: newDistance })
    drawImage()

    if (Math.abs(newDistance) >= $canvas.width) {
      state.setState({ index: nextIndex() })
      stopDragging()
      drawImage()
      clearInterval(timer)
    }
  }, 1)
}

const handleMove = event => {
  event.preventDefault()
  event.stopPropagation()

  const { isDragging } = state.current

  if (isDragging) {
    updateMouseDistance(event.clientX)
    drawImage()

    if (shouldSwitchImage()) {
      state.setState({ isDragging: false })
      animateTransition()
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

window.onload = () => start()
