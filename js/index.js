import { WASI } from './wasi.js';
import { WebGL } from './webgl.js';

const wasi = new WASI();

let gl = null;
const canvas = document.getElementById('canvas');
try {
  gl = canvas.getContext("webgl");
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
} catch (e) {
}
if (!gl) {
  console.error('WebGL is not avaiable on your browser!');
} else {
  console.log('WebGL context initialized.');
}

const webgl = new WebGL(gl);
const importModule = {
  wasi_snapshot_preview1: wasi,
  webgl: webgl,
};

(async () => {
  const result = await WebAssembly.instantiateStreaming(fetch('app.wasm'), importModule);
  wasi.setModuleInstance(result.instance);
  webgl.setModuleInstance(result.instance);
  result.instance.exports._start();
})();
