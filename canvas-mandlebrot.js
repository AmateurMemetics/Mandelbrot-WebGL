class Mandlebrot {
  constructor (context) {
    this.context = context
    this.viewWidth = context.canvas.width
    this.viewHeight = context.canvas.height
    this.centerX = 0.25
    this.centerY = 0
    this.width = 0.003
    this.height = 0.002
    this.calculate()
  }

  static calculateColour (x, y) {
    const mandlebrotSteps = (x, y) => {
      let iter = 0
      let a = 0
      let b = 0
      while (++iter < 256) {
        let newA = a * a - b * b
        let newB = 2 * a * b
        a = newA + x
        b = newB + y
        if (a * a + b * b > 4) {
          break
        }
      }
      return iter
    }

    const val = 255 - mandlebrotSteps(x, y)
    return `rgb(${val}, ${val}, ${val})`
  }

  clear () {
    this.context.fillStyle = 'rgb(255, 255, 255)'
    this.context.fillRect(0, 0, width, height)
  }

  draw () {
    this.context.fillStyle = 'rgb(0, 0, 0)'
    for (let x = width - 1; x >= 0; x--) {
      for (let y = height - 1; y >= 0; y--) {
        this.context.fillStyle = Mandlebrot.calculateColour(
          (x * this.scaleX) + this.offsetX,
          (y * this.scaleY) + this.offsetY)
        this.context.fillRect(x, y, 1, 1)
      }
    }
  }

  calculate () {
    this.scaleX = this.width / this.viewWidth
    this.scaleY = this.height / this.viewHeight
    this.offsetX = this.centerX - this.width / 2
    this.offsetY = this.centerY - this.height / 2
  }

  zoom () {
    this.width = this.width * 0.10
    this.height = this.height * 0.10
  }

  step () {
    this.clear()
    this.draw()
    this.zoom()
    this.calculate()
  }
}

const canvas = document.querySelector('canvas')

const width = canvas.width = canvas.clientWidth
const height = canvas.height = canvas.clientHeight

const context = canvas.getContext('2d')

const mandlebrot = new Mandlebrot(context)
mandlebrot.step()

// const frameRate = 60
// window.setInterval(() => {
//  mandlebrot.step()
// }, 1000 / frameRate)
