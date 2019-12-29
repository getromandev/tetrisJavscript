// first thing we need to do is access the canvas
const canvas = document.getElementById('tetris');
// get context out to draw on the DOM element
const context = canvas.getContext('2d');

// scale the context to make pieces larger
context.scale(20, 20)


// create data structures for our tetris pieces: https://medium.com/@markmliu/the-tetris-proof-60a7a69a8e04
// create the T shape with a 2D Matrix
const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

// create a draw function to handle the players input into the draw
function draw() {
    // create tetris backdrop 
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(player.matrix, player.pos);
}

// wrap the matrix draw in a function with matrix and offset as parameters
function drawMatrix(matrix, offset) {
// draw this first piece to the canvas
    matrix.forEach((row, y) => {
        // console.log('this is the row', row)
        // console.log('this is the y', y);

        row.forEach((value, x) => {
            // console.log('this is the value', value)
            // console.log('this is the x', x);

            // if the value is not 0 then we draw
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        })
    })
}

// drop piece two places
function playerDrop() {
    player.pos.y ++;
    dropCounter = 0;
}

// set up a drop counter to keep track off the time it takes to drop the piece 
let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
// add update function to let the play draw continously via animation frame
// account for dropping the tetris piece with time 
function update(time = 0) {
    const delaytime = time - lastTime;
    
    lastTime = time;
    dropCounter += delaytime;

    // console.log('time:', time)
    // console.log('lastTime:', lastTime);
    // console.log('delaytime:', delaytime);
    // console.log('dropCounter:', dropCounter);

    if(dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

// add player structure
const player = {
    pos: {x: 5, y: 5},
    matrix: matrix,
}

// add keyboard controls for the player
document.addEventListener('keydown', event => {
    // with this log we are able to dig into the event object and discover the keycode needed to track controls for the player 
    console.log('event', event);

    if (event.keyCode === 37) {
        player.pos.x --;
    } else if (event.keyCode === 39) {
        player.pos.x ++;
    } else if (event.keyCode === 40) {
        playerDrop();
    }

})

update();