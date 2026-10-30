import { ShaderBackground } from "@frapx/react-canvas";
import { createRoot } from "react-dom/client";

const fragment = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 v_uv = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(v_uv, 0.5 + 0.5 * sin(u_time), 1.0);
}
`;

createRoot(document.getElementById("stage")!).render(
  <ShaderBackground fragment={fragment} style={{ position: "absolute", inset: 0 }} />
);
