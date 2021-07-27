function Canvas(element) {
  this.canvas = element
  this.maxWidth = element.width
  this.maxHeight = element.height
  this.context = this.canvas.getContext('2d')

  this.scalingFactor = (original, computed) => computed / original

  this.imageMargin = (imageSize, maxSize) => (
    imageSize < maxSize ? (maxSize - imageSize) * 0.5 : 0
  )

  this.scaleToFit = (image) => {
    const originalWidth = image.width
    const originalHeight = image.height

    const xFactor = this.scalingFactor(originalWidth, this.maxWidth)
    const yFactor = this.scalingFactor(originalHeight, this.maxHeight)

    const largestFactor = Math.min(xFactor, yFactor)

    const resizedWidth = largestFactor * originalWidth
    const resizedHeight = largestFactor * originalHeight

    return { resizedWidth, resizedHeight }
  }

  this.draw = (image, { sx, sy, sw, sh, dx, dy, dw, dh }) => {
    this.context.drawImage(
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
      dx: this.imageMargin(resizedWidth, this.maxWidth) - mouseDragDistance,
      dy: this.imageMargin(resizedHeight, this.maxHeight),
      dw: resizedWidth,
      dh: resizedHeight
    }
  }

  this.drawMainImage = (image, mouseDragDistance) => {
    this.context.clearRect(0, 0, this.maxWidth, this.maxHeight)
    this.draw(image, this.dimensionsToDraw(image, mouseDragDistance))
  }

  this.drawNextImage = (image, mouseDragDistance) => {
    if (mouseDragDistance === 0) return

    const startingPoint = (this.maxWidth - mouseDragDistance) * -1
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
