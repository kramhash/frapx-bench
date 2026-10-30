// The same picture for every library: a gradient over UV that pulses with time.
// GLSL ES 1.00 so every library accepts it unchanged.
export const fragment = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;

void main() {
  gl_FragColor = vec4(v_uv, 0.5 + 0.5 * sin(u_time), 1.0);
}
`;

// Full-screen vertex shader for libraries that need one (frapx brings its own).
export const vertex = `
attribute vec2 position;
varying vec2 v_uv;

void main() {
  v_uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
