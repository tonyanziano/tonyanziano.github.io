// this function creates a shader given the source code and type
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  // sends the source code to the shader and compiles it
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // check for compilation errors
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      `Error trying to compile ${type} shader: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return;
  }

  return shader;
}

// this function creates the shader program and compiles it
function initShaderProgram(gl, vertexSrc, fragSrc) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  // check for compilation errors
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      `Error initializing shader program: ${gl.getProgramInfoLog(program)}`,
    );
    return;
  }

  return program;
}

/**
 * Source for shaders
 */

const vertexSrc = `
  attribute vec4 aVertexPosition;
  attribute vec4 aColor;

  uniform mat4 uProjectionMatrix;
  uniform mat4 uViewMatrix;
  uniform mat4 uModelViewMatrix;

  varying mediump vec4 vColor;

  void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aColor;
  }
`;

const fragSrc = `
  varying mediump vec4 vColor;

  void main() {
    // white color
    gl_FragColor = vColor;
  }
`;

/**
 * Drawing the scene
 */

let numOfVertices = 0;
function generateVerticesForCube(gl, buffers, cubeSize = 2) {
  const s = cubeSize / 2;

  // cube vertices (6 vertices per side * 6 sides)
  const vertices = [
    // front face
    +s, +s, +s,
    +s, -s, +s,
    -s, -s, +s,
    +s, +s, +s,
    -s, -s, +s,
    -s, +s, +s,

    // back face
    +s, +s, -s,
    -s, +s, -s,
    -s, -s, -s,
    +s, +s, -s,
    -s, -s, -s,
    +s, -s, -s,

    // // top face
    -s, +s, +s,
    -s, +s, -s,
    +s, +s, -s,
    -s, +s, +s,
    +s, +s, -s,
    +s, +s, +s,

    // // bottom face
    +s, -s, -s,
    -s, -s, +s,
    +s, -s, +s,
    +s, -s, -s,
    -s, -s, -s,
    -s, -s, +s,

    // // right face
    +s, +s, -s,
    +s, -s, -s,
    +s, -s, +s,
    +s, +s, -s,
    +s, -s, +s,
    +s, +s, +s,

    // // left face
    -s, +s, +s,
    -s, -s, +s,
    -s, -s, -s,
    -s, +s, +s,
    -s, -s, -s,
    -s, +s, -s,
  ];
  const numCubeVertices = vertices.length / 3; // each vertex is made of 3 components

  // bind to the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
  // feed data into the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // define colors
  const colorPalette = [
    // front face
    [255, 0, 0, 1],

    // back face
    [0, 0, 255, 1],

    // top face
    [0, 255, 0, 1],

    // bottom face
    [120, 120, 0, 1],

    // right face
    [0, 120, 120, 1],

    // left face
    [120, 0, 120, 1],
  ];
  const colorsPerVertex = [];

  const verticesPerFace = 6;
  for (let i = 0; i < numCubeVertices; i++) {
    const cubeFaceIndex = Math.floor(i / verticesPerFace);
    colorsPerVertex.push(...colorPalette[cubeFaceIndex]);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colorsPerVertex), gl.STATIC_DRAW);

  // inc num of vertices
  numOfVertices += numCubeVertices;
}

// this function fills all the utilized buffers with necessary data for drawing the scene
function getBuffersForScene(gl) {
  // create the position buffer
  const buffers = {
    colorBuffer: gl.createBuffer(),
    positionBuffer: gl.createBuffer(),
  };

  generateVerticesForCube(gl, buffers);

  return buffers;
}

function generateModelMatrix(gl, programInfo, timestamp, objToDraw) {
  // NOTE: When using gl-matrix.js: [1, 1, 1] == [Y, X, Z]
  // model matrix (model to world space)
  const modelViewMatrix = mat4.create();

  // NOTE:
  // We need to spin the cube before moving it or else it will spin relative
  // to the world space's origin -- so spin the cube last

  // push the cube away from the camera
  mat4.translate(modelViewMatrix, modelViewMatrix, [objToDraw.translateY, objToDraw.translateX, objToDraw.translateZ]);

  // spin the cube
  mat4.rotateX(modelViewMatrix, modelViewMatrix, timestamp * objToDraw.rotateXSpeed * 0.002);
  mat4.rotateY(modelViewMatrix, modelViewMatrix, timestamp * objToDraw.rotateYSpeed * 0.002);
  mat4.rotateZ(modelViewMatrix, modelViewMatrix, timestamp * objToDraw.rotateZSpeed * 0.002);

  mat4.scale(modelViewMatrix, modelViewMatrix, [2, 2, 2]);

  // pass it to the vertex shader
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );
}

function generateViewMatrix(gl, programInfo) {
  // view matrix (world space to camera / view space)
  const viewMatrix = mat4.create();
  // pass it to the vertex shader
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.viewMatrix,
    false,
    viewMatrix,
  );
}

function generateProjectionMatrix(gl, programInfo) {
  // projection matrix (view space to clip space -- flattened image)
  const projectionMatrix = mat4.create();
  const fov = (45 * Math.PI) / 180; // 45 deg in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 100;
  mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);
  // pass it to the vertex shader
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
}

function drawScene(gl, programInfo, timestamp) {
  // clear the canvas
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); // Enable depth testing (depth of objects matters like z-index)
  gl.depthFunc(gl.LEQUAL); // Near things block far things
  gl.disable(gl.CULL_FACE); // don't cull

  gl.useProgram(programInfo.program);

  programInfo.objectsToDraw.forEach((obj) => {
    // generate the matrixes to paint the scene
    generateModelMatrix(gl, programInfo, timestamp, obj);
    generateViewMatrix(gl, programInfo);
    generateProjectionMatrix(gl, programInfo);

    // POSITION
    // pull values out of the position buffer and feed them into the vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers.positionBuffer);
    gl.vertexAttribPointer(
      programInfo.attributes.vertexPosition,
      3, // triangles have 3 points
      gl.FLOAT,
      false,
      0,
      0,
    );
    gl.enableVertexAttribArray(programInfo.attributes.vertexPosition);

    // COLOR
    gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers.colorBuffer);
    gl.vertexAttribPointer(
      programInfo.attributes.color,
      4, // rgba
      gl.UNSIGNED_BYTE,
      false, // normalize
      0,
      0,
    );
    gl.enableVertexAttribArray(programInfo.attributes.color);

    // paint the scene
    gl.drawArrays(gl.TRIANGLES, 0, numOfVertices);
  });
}

const numOfObjects = 3; // how many objects we want to render
function getObjects() {
  const objects = [];
  for (let i = 0; i < numOfObjects; i++) {
    const translateX = Math.random() * 10 - 5; // -5 to 5
    const translateY = Math.random() * 10 - 5;
    const translateZ = Math.random() * -50;
    const rotateXSpeed = Math.random();
    const rotateYSpeed = Math.random();
    const rotateZSpeed = Math.random();

    objects.push({
      translateX,
      translateY,
      translateZ,
      rotateXSpeed,
      rotateYSpeed,
      rotateZSpeed,
    });
  }
  return objects;
}

let pendingAnimationRequest;
function main() {
  // initialization
  const canvas = document.getElementById('tony-canvas');
  const gl = canvas.getContext('webgl');
  const program = initShaderProgram(gl, vertexSrc, fragSrc);

  const programInfo = {
    attributes: {
      color: gl.getAttribLocation(program, 'aColor'),
      vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    },
    buffers: getBuffersForScene(gl),
    program,
    objectsToDraw: getObjects(),
    uniformLocations: {
      modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
      projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
      viewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
    },
  };

  const drawFrame = (timestamp) => {
    drawScene(gl, programInfo, timestamp);
    pendingAnimationRequest = requestAnimationFrame(drawFrame);
  };

  // render whenever the browser says it's ok
  if (pendingAnimationRequest) {
    cancelAnimationFrame(pendingAnimationRequest);
  }
  pendingAnimationRequest = requestAnimationFrame(drawFrame);
}
