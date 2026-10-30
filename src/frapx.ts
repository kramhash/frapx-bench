import { createShaderBackground } from "@frapx/fx-canvas";

// fx-canvas supplies u_resolution, so the shader derives its UV from it.
createShaderBackground({
  target: "#stage",
  fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 v_uv = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(v_uv, 0.5 + 0.5 * sin(u_time), 1.0);
}
`
});
