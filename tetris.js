// first thing we need to do is access the canvas
const canvas = document.getElementById('tetris');
// get context out to draw on the DOM element
const context = canvas.getContext('2d');

// scale the context to make pieces larger
context.scale(20, 20)

// create tetris backdrop 
context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

// create data structures for our tetris pieces: https://medium.com/@markmliu/the-tetris-proof-60a7a69a8e04
// create the T shape with a 2D Matrix
const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

// wrap the matrix draw in a function with matrix and offset as parameters
function drawMatrix(matrix, offset) {
// draw this first piece to the canvas
    matrix.forEach((row, y) => {
        console.log('this is the row', row)
        console.log('this is the y', y);

        row.forEach((value, x) => {
            console.log('this is the value', value)
            console.log('this is the x', x);

            // if the value is not 0 then we draw
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        })
    })
}

drawMatrix(matrix, {x: 5, y: 5});