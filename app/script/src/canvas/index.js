const $canvas = document.getElementById('slider')
const MAX_WIDHT = $canvas.width
const MAX_HEIGHT = $canvas.height

const getContext = () => document.getElementById('slider').getContext('2d')

function Canvas() {
  this.scalingFactor = (original, computed) => computed / original

  this.imageMargin = (imageSize, maxSize) => (
    imageSize < maxSize ? (maxSize - imageSize) * 0.5 : 0
  )

  this.scaleToFit = (image) => {
    const originalWidth = image.width
    const originalHeight = image.height

    const xFactor = this.scalingFactor(originalWidth, MAX_WIDHT)
    const yFactor = this.scalingFactor(originalHeight, MAX_HEIGHT)

    const largestFactor = Math.min(xFactor, yFactor)

    const resizedWidth = largestFactor * originalWidth
    const resizedHeight = largestFactor * originalHeight

    return { resizedWidth, resizedHeight }
  }

  this.drawImage = (image, mouseDragDistance) => {
    const { resizedWidth, resizedHeight } = this.scaleToFit(image)

    const dx = this.imageMargin(resizedWidth, MAX_WIDHT) - mouseDragDistance
    const dy = this.imageMargin(resizedHeight, MAX_HEIGHT)

    getContext().clearRect(0, 0, MAX_WIDHT, MAX_HEIGHT)
    getContext().drawImage(
      image,
      0, 0,
      image.width, image.height,
      dx, dy,
      resizedWidth, resizedHeight
    )
  }

  this.drawNextImage = (image, mouseDragDistance) => {
    const { resizedWidth, resizedHeight } = this.scaleToFit(image)

    const startingPoint = MAX_WIDHT - mouseDragDistance
    const dx = this.imageMargin(resizedWidth, MAX_WIDHT) + startingPoint
    const dy = this.imageMargin(resizedHeight, MAX_HEIGHT)

    getContext().drawImage(
      image,
      0, 0,
      image.width, image.height,
      dx, dy,
      resizedWidth, resizedHeight
    )
  }

  this.drawPreviousImage = (image, mouseDragDistance) => {
    const { resizedWidth, resizedHeight } = this.scaleToFit(image)

    const dy = this.imageMargin(resizedHeight, MAX_HEIGHT)
    const begining = (image.width * mouseDragDistance) / resizedWidth
    const sx = image.width - Math.abs(begining)

    getContext().drawImage(
      image,
      sx, 0,
      image.width, image.height,
      0, dy,
      resizedWidth, resizedHeight
    )
  }
}

module.exports = Canvas
