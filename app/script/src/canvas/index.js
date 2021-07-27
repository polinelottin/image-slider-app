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

  this.draw = (image, { sx, sy, sw, sh, dx, dy, dw, dh }) => {
    getContext().drawImage(
      image,
      sx, sy, sw, sh, dx, dy, dw, dh
    )
  }

  this.dimensionsToDraw = (image, mouseDragDistance) => {
    const { resizedWidth, resizedHeight } = this.scaleToFit(image)

    return {
      sx: 0,
      sy: 0,
      sw: image.width,
      sh: image.height,
      dx: this.imageMargin(resizedWidth, MAX_WIDHT) - mouseDragDistance,
      dy: this.imageMargin(resizedHeight, MAX_HEIGHT),
      dw: resizedWidth,
      dh: resizedHeight
    }
  }

  this.drawMainImage = (image, mouseDragDistance) => {
    getContext().clearRect(0, 0, MAX_WIDHT, MAX_HEIGHT)
    this.draw(image, this.dimensionsToDraw(image, mouseDragDistance))
  }

  this.drawNextImage = (image, mouseDragDistance) => {
    if (mouseDragDistance === 0) return

    const startingPoint = (MAX_WIDHT - mouseDragDistance) * -1
    const dimensions = this.dimensionsToDraw(image, startingPoint)

    if (mouseDragDistance < 0) {
      const { sw, dw } = dimensions
      const proportionToShow = (sw * mouseDragDistance) / dw

      dimensions.sx = sw - Math.abs(proportionToShow)
      dimensions.dx = 0
    }

    this.draw(image, dimensions)
  }
}

module.exports = Canvas
