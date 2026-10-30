import {
  createBufferInfoFromArrays,
  createProgramInfo,
  drawBufferInfo,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms
} from "twgl.js";
import { fragment, vertex } from "./shader";

const canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
document.getElementById("stage")!.append(canvas);
const gl = canvas.getContext("webgl")!;

const programInfo = createProgramInfo(gl, [vertex, fragment]);
const bufferInfo = createBufferInfoFromArrays(gl, {
  position: { numComponents: 2, data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1] }
});

const frame = (ms: number) => {
  requestAnimationFrame(frame);
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  setUniforms(programInfo, { u_time: ms / 1000 });
  drawBufferInfo(gl, bufferInfo);
};
requestAnimationFrame(frame);
