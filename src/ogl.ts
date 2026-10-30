import { Mesh, Program, Renderer, Triangle } from "ogl";
import { fragment } from "./shader";

const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2) });
const gl = renderer.gl;
document.getElementById("stage")!.append(gl.canvas);
renderer.setSize(window.innerWidth, window.innerHeight);

// OGL's Triangle covers the screen and provides `position` and `uv`.
const program = new Program(gl, {
  vertex: `
attribute vec2 position;
attribute vec2 uv;
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,
  fragment,
  uniforms: { u_time: { value: 0 } }
});
const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

const frame = (ms: number) => {
  requestAnimationFrame(frame);
  program.uniforms.u_time.value = ms / 1000;
  renderer.render({ scene: mesh });
};
requestAnimationFrame(frame);
