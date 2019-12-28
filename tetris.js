// first thing we need to do is access the canvas
const canvas = document.getElementById('tetris');
// get context out to draw on the DOM element
const context = canvas.getContext('2d');

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);