import 'babel-polyfill'
import '../vendors'

const Gallery = require('./gallery')
const State = require('./state')
const Canvas = require('./canvas')

const gallery = new Gallery()
const canvas = new Canvas()

const state = new State({
  index: 0,
  startX: 0,
  mouseDistance: 0,
  isDragging: false
})

const $loading = document.getElementById('loading')
const $canvas = document.getElementById('slider')
const BB = $canvas.getBoundingClientRect()
const MIN_TO_SWITCH = BB.width * 0.5

const updateMouseDistance = currentPosition => {
  const offsetX = BB.left
  const mx = parseInt(currentPosition - offsetX)
  const { startX } = state.current

  state.setState({
    mouseDistance: startX - mx
  })
}

const nextIndex = () => {
  const { index, mouseDistance } = state.current

  if (mouseDistance === 0) return index

  const images = gallery.images

  const direction = mouseDistance / Math.abs(mouseDistance)
  let newIndex = index + direction

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

  canvas.drawImage(images[index], mouseDistance)
  canvas.drawNextImage(images[nextIndex()], mouseDistance)
}

const animateTransition = () => {
  let counter = 0
  const { mouseDistance } = state.current

  const timer = setInterval(function() {
    counter++
    const newDistance = mouseDistance + (10 * counter)
    state.setState({
      mouseDistance: newDistance
    })

    drawImage()

    if (newDistance >= 800) {
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
      state.setState({
        isDragging: false
      })
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
