import 'babel-polyfill'
import '../vendors'
import gallerySource from './gallerySource'
import { state, setState } from './state'
import dimensions from './canvasDimensions'

const $loading = document.getElementById('loading')
const $canvas = document.getElementById('slider')
const BB = $canvas.getBoundingClientRect()
const WIDTH = $canvas.width
const HEIGHT = $canvas.height
const MIN_TO_SWITCH = BB.width * 0.5

const getContext = () => document.getElementById('slider').getContext('2d')

const updateCurrentMouseDistance = currentPosition => {
  const offsetX = BB.left
  const mx = parseInt(currentPosition - offsetX)

  setState({
    ...state,
    currentMouseDistance: state.startX - mx
  })
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
  const { images, currentIndex, currentMouseDistance } = state
  const image = images[currentIndex]

  dimensions.readDimensions(image, state).scaleToFit()
  const { dx, dy, dWidth, dHeight } = dimensions

  getContext().clearRect(0, 0, WIDTH, HEIGHT)
  getContext().drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight)

  if (currentMouseDistance !== 0) {
    const nextIndex = getNextIndex(currentMouseDistance / Math.abs(currentMouseDistance))
    const nextImage = images[nextIndex]

    dimensions.readDimensions(nextImage, state).scaleToFit()
    const dww = WIDTH - currentMouseDistance
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

        setState({
          ...state,
          images: [
            ...state.images,
            img
          ]
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}

const handleMove = event => {
  event.preventDefault()
  event.stopPropagation()

  const { isDragging, currentMouseDistance } = state

  if (isDragging) {
    updateCurrentMouseDistance(event.clientX)
    selectAreaAndDraw()

    if (Math.abs(currentMouseDistance) > MIN_TO_SWITCH) {
      setState({
        ...state,
        currentIndex: getNextIndex(currentMouseDistance / Math.abs(currentMouseDistance))
      })

      stopDrag()
      selectAreaAndDraw()
    }
  }
}

const startDrag = event => {
  setState({
    ...state,
    startX: event.layerX,
    isDragging: true
  })
}

const stopDrag = () => {
  setState({
    ...state,
    isDragging: false,
    currentMouseDistance: 0
  })
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
  $loading.style.display = 'block'

  addListeners()
  setState({
    currentIndex: 0,
    images: [],
    isDragging: false,
    startX: 0,
    currentMouseDistance: 0
  })

  await loadImages()

  selectAreaAndDraw()
  $loading.style.display = 'none'
}

window.onload = function () {
  start()
}
