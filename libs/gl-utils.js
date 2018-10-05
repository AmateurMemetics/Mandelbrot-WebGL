/* global fetch */

class GlUtils {
  static getGl (canvas, options) {
    return canvas.getContext('webgl', options)
  }

  static createProgram (gl, vertexShader, fragmentShader) {
    // Create and return a shader program
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    // Check that shader program was able to link to WebGL
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var error = gl.getProgramInfoLog(program)
      console.log('Failed to link program: ' + error)
      gl.deleteProgram(program)
      gl.deleteShader(fragmentShader)
      gl.deleteShader(vertexShader)
      return null
    }

    // Set the vertex and fragment shader to the program for easy access
    program.vertexShader = vertexShader
    program.fragmentShader = fragmentShader

    // Create buffers for all vertex attributes
    program.vertexShader.attributes.forEach(attribute => {
      program[attribute.name] = gl.createBuffer()
    })

    return program
  }

  static getShader (gl, type, source) {
    // Get, compile, and return an embedded shader object
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    // Check if compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    // Set the attributes, varying, and uniform to shader
    shader.attributes = this.variableFromSource(source, GlUtils.ATTRIBUTE)
    shader.varyings = this.variableFromSource(source, GlUtils.VARYING)
    shader.uniforms = this.variableFromSource(source, GlUtils.UNIFORM)
    return shader
  }

  static variableFromSource (source, type) {
    const regex = new RegExp(`^${type} .*? (\\w+);`, 'g')
    let matches = []
    let search
    while ((search = regex.exec(source)) !== null) {
      // Push first group
      matches.push(search[1])
    }
    return matches
  }

  static loadShaders (callback) {
    const elements = Array.from(document.getElementsByName('shader'))
    const requests = elements.map(element => fetch(element.getAttribute('data-src')))
    Promise.all(requests)
      .then(responses => Promise.all(responses.map(response => response.text())))
      .then(shaders => {
        GlUtils.shaders = shaders.reduce((acc, cur, idx) => {
          acc[elements[idx].getAttribute('data-type')] = cur
          return acc
        }, {})
        try {
          callback()
          console.log('Started GL successfully')
        } catch (error) {
          console.error(error)
        }
      })
  }
}

// Constants
GlUtils.UNIFORM = 'uniform'
GlUtils.VARYING = 'varying'
GlUtils.ATTRIBUTE = 'attribute'

// Expose GlUtils globally
window.GlUtils = GlUtils
