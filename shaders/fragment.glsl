precision highp float;

uniform float uScale;
uniform float uWidth;
uniform float uHeight;

void mandelbrot(vec2 c, out int count) {
  vec2 z = vec2(0.0, 0.0);

  for (int i = 0; i < 256; i++) {
    if (z.x * z.x + z.y * z.y >= 4.0) {
      break;
    }
    count = i;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
  }
}

void scale(vec2 view, vec2 centre, float factor, out vec2 real) {
  real = (view / factor) + centre;
}

void main() {
  vec2 resolution = vec2(uWidth, uHeight);
  float aspectRatio = uWidth / uHeight;

  // View between -1 and +1
  vec2 view = 2.0 * ((gl_FragCoord.xy / resolution) - 0.5);

  // Adjust for aspect ratio
  vec2 normalisedView = vec2(view.x * aspectRatio, view.y);

  vec2 real;
  scale(normalisedView, vec2(0.25, 0.0), uScale, real);

  int count;
  mandelbrot(real, count);

  float color = float(count);
  color /= 256.0;
  // depth is always the same in window coordinates
  //float z = gl_FragCoord.z;
  // gl_FragColor = vec4(x, y, z, 1.0);
  gl_FragColor = vec4(color, color, color, 1.0);
}