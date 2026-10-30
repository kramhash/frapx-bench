import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from "three";
import { fragment } from "./shader";

const renderer = new WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("stage")!.append(renderer.domElement);

const material = new ShaderMaterial({
  uniforms: { u_time: { value: 0 } },
  // three supplies `position` and `uv`; pass the UV through.
  vertexShader: `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,
  fragmentShader: fragment.replace("precision mediump float;", "")
});
const scene = new Scene();
scene.add(new Mesh(new PlaneGeometry(2, 2), material));
const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

renderer.setAnimationLoop((ms) => {
  material.uniforms.u_time!.value = ms / 1000;
  renderer.render(scene, camera);
});
