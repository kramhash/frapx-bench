// Babylon's lightest path for a full-screen shader: ThinEngine + EffectRenderer,
// imported per module so tree-shaking applies.
import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectRenderer, EffectWrapper } from "@babylonjs/core/Materials/effectRenderer";

const canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
document.getElementById("stage")!.append(canvas);

const engine = new ThinEngine(canvas);
const renderer = new EffectRenderer(engine);
// EffectRenderer's vertex shader provides `vUV`.
const effect = new EffectWrapper({
  engine,
  name: "pulse",
  fragmentShader: `
precision mediump float;
varying vec2 vUV;
uniform float u_time;

void main() {
  gl_FragColor = vec4(vUV, 0.5 + 0.5 * sin(u_time), 1.0);
}
`,
  uniformNames: ["u_time"]
});

let time = 0;
effect.onApplyObservable.add(() => {
  effect.effect.setFloat("u_time", time);
});
window.addEventListener("resize", () => engine.resize());
engine.runRenderLoop(() => {
  time = performance.now() / 1000;
  if (effect.isReady()) renderer.render(effect);
});
