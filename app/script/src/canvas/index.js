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

  this.dimensionsToDraw = (image) => {
    const { resizedWidth, resizedHeight } = this.scaleToFit(image)

    return {
      sx: 0,
      sy: 0,
      sw: image.width,
      sh: image.height,
      dx: this.imageMargin(resizedWidth, this.maxWidth),
      dy: this.imageMargin(resizedHeight, this.maxHeight),
      dw: resizedWidth,
      dh: resizedHeight
    }
  }

  this.drawMainImage = (image, mouseDragDistance) => {
    this.context.clearRect(0, 0, this.maxWidth, this.maxHeight)
    const dimensions = this.dimensionsToDraw(image)
    dimensions.dx = dimensions.dx - mouseDragDistance
    this.draw(image, dimensions)
  }

  this.drawNextImage = (image, mouseDragDistance) => {
    if (mouseDragDistance === 0) return

    if (mouseDragDistance > 0) {
      const dimensions = this.dimensionsToDraw(image)
      dimensions.dx = dimensions.dx + this.maxWidth - mouseDragDistance

      this.draw(image, dimensions)
      return
    }

    if (mouseDragDistance < 0) {
      const dimensions = this.dimensionsToDraw(image)
      const { dx, sw, dw } = dimensions

      if (Math.abs(mouseDragDistance) > dx) {
        const diff = Math.abs(mouseDragDistance) - dx
        const proportionToShow = (sw * diff) / dw

        dimensions.sx = sw - Math.abs(proportionToShow)
        dimensions.dx = 0

        this.draw(image, dimensions)
      }
    }
  }
}

module.exports = Canvas
