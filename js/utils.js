// how much to tilt the "camera" by in the WebGL scene
let tiltFactorX = 0;
let tiltFactorY = 0;

// depending on the position of the cursor on the page, tilt the "camera" inside of the WebGL scene
document.body.onmousemove = (ev) => {
  const posX = ev.pageX;
  const pageWidth = document.body.clientWidth;
  const pageWidthHalfwayPoint = pageWidth / 2;
  const cursorOffsetFromMiddleX = posX - pageWidthHalfwayPoint;
  // scale the value down to 0 - 1 range
  tiltFactorX = cursorOffsetFromMiddleX / pageWidthHalfwayPoint;

  const posY = ev.pageY;
  const pageHeight = document.body.clientHeight;
  const pageHeightHalfwayPoint = pageHeight / 2;
  const cursorOffsetFromMiddleY = posY - pageHeightHalfwayPoint;
  // scale the value down to 0 - 1 range
  tiltFactorY = cursorOffsetFromMiddleY / pageHeightHalfwayPoint;
};
