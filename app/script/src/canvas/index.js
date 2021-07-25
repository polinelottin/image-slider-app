const $canvas = document.getElementById('slider')
const MAX_WIDHT = $canvas.width
const MAX_HEIGHT = $canvas.height

const getContext = () => document.getElementById('slider').getContext('2d')

function Canvas() {
  this.scalingFactor = (original, computed) => {
    return computed / original
  }
  this.imageMargin = (imageSize, maxSize) => {
    return imageSize < maxSize ? (maxSize - imageSize) * 0.5 : 0
  }
  this.scaleToFit = (image, currentMouseDistance) => {
    const originalWidth = image.width
    const originalHeight = image.height

    const xFactor = this.scalingFactor(originalWidth, MAX_WIDHT)
    const yFactor = this.scalingFactor(originalHeight, MAX_HEIGHT)

    const largestFactor = Math.min(xFactor, yFactor)

    const resizedWidth = largestFactor * originalWidth
    const resizedHeight = largestFactor * originalHeight

    const dx = this.imageMargin(resizedWidth, MAX_WIDHT) - currentMouseDistance
    const dy = this.imageMargin(resizedHeight, MAX_HEIGHT)

    return { resizedWidth, resizedHeight, dx, dy }
  }
  this.drawImage = (image, currentMouseDistance) => {
    const {
      resizedWidth,
      resizedHeight,
      dx, dy
    } = this.scaleToFit(image, currentMouseDistance)

    getContext().clearRect(0, 0, MAX_WIDHT, MAX_HEIGHT)
    getContext().drawImage(
      image,
      0, 0,
      image.width, image.height,
      dx, dy,
      resizedWidth, resizedHeight
    )
  }
}

module.exports = Canvas
