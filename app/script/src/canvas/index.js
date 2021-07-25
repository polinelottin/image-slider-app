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

  this.drawImage = (image, currentMouseDistance) => {
    const { resizedWidth, resizedHeight } = this.scaleToFit(image)

    const dx = this.imageMargin(resizedWidth, MAX_WIDHT) - currentMouseDistance
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

  this.drawNextImage = (image, currentMouseDistance) => {
    const { resizedWidth, resizedHeight } = this.scaleToFit(image, currentMouseDistance)

    const startingPoint = MAX_WIDHT - currentMouseDistance
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
}

module.exports = Canvas
