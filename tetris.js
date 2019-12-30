// first thing we need to do is access the canvas
const canvas = document.getElementById('tetris');
// get context out to draw on the DOM element
const context = canvas.getContext('2d');

// scale the context to make pieces larger
context.scale(20, 20)

// create a collion detection function 
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && 
                (arena[y + o.y] && 
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// create function to store all the stock matrix pieces
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    console.log(matrix);
    return matrix;
}

// create data structures for our tetris pieces: https://medium.com/@markmliu/the-tetris-proof-60a7a69a8e04
// create the T shape with a 2D Matrix
// write a function that creates new tetris pieces 
function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]       
    } else if (type === 'O') {
        return [
            [1, 1],
            [1, 1]
        ]  
    } else if (type === 'L') {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ]
    } else if (type === 'J') {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ]
    } else if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ]
    } else if (type === 'S') {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    } else if (type === 'Z') {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]
    }
}

// create a draw function to handle the players input into the draw
function draw() {
    // create tetris backdrop 
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x:0, y: 0});
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

// add a merge function to connect the arena and player 
function merge(area, player){
    console.table(area);
    // console.log('this is player:', player)
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    })
}

// drop piece two places
function playerDrop() {
    player.pos.y ++;
    // add the collision function here that says if the the player drops and collide then we are touching the ground or another piece 
    if (collide(arena, player)) {
        player.pos.y --;
        merge(arena, player);
        playerReset();
    }
    dropCounter = 0;
}

// create a function that hanldes the coliding to not exceed the right and left walls 
function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

// create a function that selects random pieces from the createPiece function matrix's 
function playerReset() {
    const pieces = 'ILJOTSZ'
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - 
                   (player.matrix[0].length / 2 | 0);

    // clear the arena if we stack up all the pieces
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
    }
}

// function that handles the player rotating the piece 
function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

// write a function that rotates the array 
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x]
            ] = [
                matrix[y][x],
                matrix[x][y]
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
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

const arena = createMatrix(12, 20);
console.log(arena);
console.table(arena);

// add player structure
const player = {
    pos: {x: 5, y: 5},
    matrix: createPiece('T'),
}

// add keyboard controls for the player
document.addEventListener('keydown', event => {
    // with this log we are able to dig into the event object and discover the keycode needed to track controls for the player 
    // console.log('event', event);

    if (event.keyCode === 37) {
        playerMove(-1) 
    } else if (event.keyCode === 39) {
        playerMove(1)
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1)
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

update();