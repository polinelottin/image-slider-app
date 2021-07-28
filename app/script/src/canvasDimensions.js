const $canvas = document.getElementById('slider')
const WIDTH = $canvas.width
const HEIGHT = $canvas.height

const dimensions = {
  maxHeight: HEIGHT,
  maxWidth: WIDTH,
  dWidth: 800,
  dHeight: 600,
  dx: 0,
  dy: 0,
  state: {},
  readDimensions: function(image, state) {
    this.dWidth = image.width
    this.dHeight = image.height
    this.state = state
    return this
  },
  largestProperty: function () {
    return this.dHeight > this.dWidth ? 'height' : 'width'
  },
  scalingFactor: function(original, computed) {
    return computed / original
  },
  imageMargin: function(maxSize, imageSize) {
    return imageSize < maxSize ? (maxSize - imageSize) * 0.5 : 0
  },
  scaleToFit: function() {
    const xFactor = this.scalingFactor(this.dWidth, this.maxWidth)
    const yFactor = this.scalingFactor(this.dHeight, this.maxHeight)

    const largestFactor = Math.min(xFactor, yFactor)

    this.dWidth *= largestFactor
    this.dHeight *= largestFactor

    this.dx = this.imageMargin(this.maxWidth, this.dWidth) - this.state.currentMouseDistance
    this.dy = this.imageMargin(this.maxHeight, this.dHeight)
  }
}

export default dimensions
