import {
  pcharToJSString,
} from './utils.js';

export function OpenGLES(gl) {
  let view = null;
  let moduleInstanceExports = null;
  const objHeap = new Array(1024 * 64);
  objHeap[0] = null; // Avoid using this slot

  function getEmptyHandle() {
    for (let i = 1; i < objHeap.length; i++){
      if (objHeap[i] === undefined) {
        return i;
      }
    }
    return 0;
  }

  function createHandle(obj) {
    const handle = getEmptyHandle();
    if (handle === 0) {
      return handle;
    }
    objHeap[handle] = obj;
    return handle;
  }

  function releaseHandle(handle) {
    if (handle === 0) {
      return null;
    }
    const obj = objHeap[handle];
    objHeap[handle] = undefined;
    return obj;
  }

  // Private Helpers
  function refreshMemory() {
    if (!view || view.buffer.byteLength === 0) {
      view = new DataView(moduleInstanceExports.memory.buffer);
    }
  }

  // Public APIs
  function setModuleInstance(instance) {
    moduleInstanceExports = instance.exports;
  }

  function glClearColor(red, green, blue, alpha) {
    gl.clearColor(red, green, blue, alpha);
  }

  function glViewport(x, y, width, height) {
    gl.viewport(x, y, width, height);
  }

  function glClear(mask) {
    gl.clear(mask);
  }

  function glEnable(cap) {
    gl.enable(cap);
  }

  function glDisable(cap) {
    gl.disable(cap);
  }

  function glCreateBuffers(n, buffers) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = gl.createBuffer();
      view.setUint32(buffers + i * 4, createHandle(buf), true);
    }
  }

  function glBindBuffer(target, handle) {
    gl.bindBuffer(target, objHeap[handle]);
  }

  function glBufferData(target, size, data, usage) {
    refreshMemory();
    const buf = new Uint8Array(moduleInstanceExports.memory.buffer, data, size);
    gl.bufferData(target, buf, usage);
  }

  function glCreateShader(shaderType) {
    return createHandle(gl.createShader(shaderType));
  }

  function glShaderSource(handle, count, sources, lengths) {
    refreshMemory();
    for (let i = 0; i < count; i++) {
      const shader = objHeap[handle];
      const source = view.getUint32(sources + i * 4, true);
      const len = view.getUint32(lengths + i * 4, true);
      const s = pcharToJSString(view, moduleInstanceExports.memory.buffer, source, len);
      gl.shaderSource(shader, s);
    }
  }

  function glCompileShader(handle) {
    gl.compileShader(objHeap[handle]);
  }

  function glCreateProgram() {
    return createHandle(gl.createProgram());
  }

  function glAttachShader(progHandle, shaderHandle) {
    const shader = objHeap[shaderHandle];
    const prog = objHeap[progHandle];
    gl.attachShader(prog, shader);
  }

  function glLinkProgram(handle) {
    gl.linkProgram(objHeap[handle]);
  }

  function glUseProgram(handle) {
    gl.useProgram(objHeap[handle]);
  }

  function glGetAttribLocation(handle, name) {
    refreshMemory();
    const s = pcharToJSString(view, moduleInstanceExports.memory.buffer, name);
    const prog = objHeap[handle];
    return gl.getAttribLocation(prog, s);
  }

  function glVertexAttribPointer(indx, size, _type, normalized, stride, ptr) {
    gl.vertexAttribPointer(indx, size, _type, normalized, stride, ptr);
  }

  function glEnableVertexAttribArray(indx) {
    gl.enableVertexAttribArray(indx);
  }

  function glDrawElements(mode, count, _type, indices) {
    gl.drawElements(mode, count, _type, indices);
  }

  return {
    setModuleInstance: setModuleInstance,
    glClearColor: glClearColor,
    glViewport: glViewport,
    glClear: glClear,
    glEnable: glEnable,
    glDisable: glDisable,
    glCreateBuffers: glCreateBuffers,
    glBindBuffer: glBindBuffer,
    glBufferData: glBufferData,
    glCreateShader: glCreateShader,
    glShaderSource: glShaderSource,
    glCompileShader: glCompileShader,
    glCreateProgram: glCreateProgram,
    glAttachShader: glAttachShader,
    glLinkProgram: glLinkProgram,
    glUseProgram: glUseProgram,
    glGetAttribLocation: glGetAttribLocation,
    glVertexAttribPointer: glVertexAttribPointer,
    glEnableVertexAttribArray: glEnableVertexAttribArray,
    glDrawElements: glDrawElements,
  };
};
