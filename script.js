/* global GlUtils */

class Mandlebrot {
  constructor (canvas) {
    // Globals
    this.canvas = canvas
    this.gl = GlUtils.getGl(this.canvas, { preserveDrawingBuffer: true })
    this.initialTime = Date.now()
  }

  init () {
    this.initShaders()
    this.initGL()
    this.setSize()
    this.animate()
  }

  setSize () {
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.draw()
  }

  initShaders () {
    const vertexShader = GlUtils.getShader(this.gl, this.gl.VERTEX_SHADER, GlUtils.shaders.vertex)
    const fragmentShader = GlUtils.getShader(this.gl, this.gl.FRAGMENT_SHADER, GlUtils.shaders.fragment)
    this.program = GlUtils.createProgram(this.gl, vertexShader, fragmentShader)
    this.gl.useProgram(this.program)
  }

  initGL () {
    this.gl.clearColor(0, 0, 0, 1)
  }

  animate () {
    this.tick = () => {
      this.time = (Date.now() - this.initialTime) / 1000
      this.draw()
    }

    // TODO: animate using tick function
    window.setInterval(this.tick, 1000 / 60)
  }

  renderBuffers (arrays, vertices) {
    this.program.vertexShader.attributes
      .forEach(name => {
        const attributeLocation = this.gl.getAttribLocation(this.program, name)
        this.gl.enableVertexAttribArray(attributeLocation)
        this.gl.vertexAttribPointer(
          attributeLocation,
          arrays[name].size,
          this.gl.FLOAT,
          false,
          vertices.BYTES_PER_ELEMENT * vertices.stride,
          vertices.BYTES_PER_ELEMENT * arrays[name].offset)
      })
  }

  draw () {
    const vertices = new Float32Array([
      // points
      -1.0, -1.0, -1.0, +1.0, +1.0, -1.0, +1.0, +1.0
    ])
    vertices.stride = 2

    const arrays = {
      aPosition: {
        size: 2,
        offset: 0
      }
    }

    let n = vertices.length / vertices.stride

    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)
    this.renderBuffers(arrays, vertices)

    const uScale = this.gl.getUniformLocation(this.program, 'uScale')
    const uHeight = this.gl.getUniformLocation(this.program, 'uHeight')
    const uWidth = this.gl.getUniformLocation(this.program, 'uWidth')
    this.gl.uniform1f(uScale, 1 + this.time / 10)
    this.gl.uniform1f(uHeight, this.canvas.height)
    this.gl.uniform1f(uWidth, this.canvas.width)

    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, n)
  }
}

const mandlebrot = new Mandlebrot(document.querySelector('canvas'))

GlUtils.loadShaders(mandlebrot.init.bind(mandlebrot))

window.addEventListener('resize', mandlebrot.setSize.bind(mandlebrot))
