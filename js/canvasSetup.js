function resizeCanvasToFillParent() {
  const canvas = document.getElementById('tony-canvas');
  if (canvas) {
    const canvasParent = canvas.parentElement;
    const parentDimensions = canvasParent.getBoundingClientRect();
    canvas.setAttribute('width', `${parentDimensions.width}px`);
    canvas.setAttribute('height', `${parentDimensions.height}px`);
  }
}

// toggles the display state of the canvas
function toggleCanvas() {
  const canvas = document.getElementById('tony-canvas');
  if (canvas) {
    const canvasDisplay = canvas.style.display;
    if (canvasDisplay === 'none') {
      canvas.style.display = 'initial';
      resizeCanvasToFillParent();
      main();
    } else if (canvasDisplay === 'initial' || canvasDisplay === '') {
      canvas.style.display = 'none';
    }
  }
}

/* eslint-disable no-unused-vars */
const canvasUtils = {
  resizeCanvasToFillParent,
  toggleCanvas,
};
