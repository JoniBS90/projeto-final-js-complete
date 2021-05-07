document.addEventListener('DOMContentLoaded', init, false);

function init() {

    let cvs = document.getElementById('tetris');
    let ctx = cvs.getContext('2d');
    let scoreElement = document.getElementById("score");
    let highscoreElement = document.getElementById("highscore");
    let levelElement = document.getElementById("level");
    let startElement = document.getElementById("start");
    let continueElement = document.getElementById("continue");
    let restartElement = document.getElementById("restart");
    let tryAgainElement = document.getElementById("try_again");
    let normalElement = document.getElementById("normal");
    let hardElement = document.getElementById("hard");

    let pauseMenu = document.getElementById("Pause_menu");
    let startMenu = document.getElementById("Start_menu");
    let gameOverMenu = document.getElementById("gameOverMenu");

    let ROW = 20;
    let COL = COLUMN = 10;
    let SQ = squareSize = 40;
    let VACANT = "white";
    var score = 0;
    var highscore = localStorage.getItem("highscore");
    let level = 1;
    highscoreElement.innerHTML = highscore;

    let pause = false;

    let hardMode = false;

    let pauseMode = false;


    //draw a square
    function drawSquare(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

        ctx.strokeStyle = "BLACK";
        ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }

    drawSquare(0, 0, "red")

    // create the board

    let board = [];
    for (r = 0; r < ROW; r++) {
        board[r] = [];
        for (c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }

    // draw the board
    function drawBoard() {
        for (r = 0; r < ROW; r++) {
            for (c = 0; c < COL; c++) {
                drawSquare(c, r, board[r][c]);
            }
        }
    }
    drawBoard();

    // Adapted
    class Piece {
        constructor(tetromino, color) {
            this.tetromino = tetromino;
            this.color = color;
            this.tetrominoN = 0;
            this.activeTetromino = this.tetromino[this.tetrominoN];

            //we need to control the pieces
            this.x = 3;
            this.y = -2;
        }
    }

    // Tetrominos

    let I = [
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ]
    ];

    let J = [
        [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 1],
            [0, 1, 0],
            [0, 1, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 1]
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ]
    ];

    let L = [
        [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [1, 0, 0]
        ],
        [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ]
    ];

    let O = [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ]
    ];

    let S = [
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        [
            [0, 1, 0],
            [0, 1, 1],
            [0, 0, 1]
        ],
        [
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0]
        ],
        [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]
    ];

    let T = [
        [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 1, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]
    ];

    let Z = [
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 0, 1],
            [0, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 1, 0],
            [1, 1, 0],
            [1, 0, 0]
        ]
    ];

    // the pieces and their colors

    let PIECES = [
        [Z, "red"],
        [S, "green"],
        [T, "yellow"],
        [O, "blue"],
        [L, "purple"],
        [I, "cyan"],
        [J, "orange"]
    ];

    // generate random pieces

    function randomPiece() {
        let r = randomN = Math.floor(Math.random() * PIECES.length); // generate 0 -> 6
        return new Piece(PIECES[r][0], PIECES[r][1]);
    }

    let p = randomPiece();

    // fill function
    Piece.prototype.fill = function (color) {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                //we draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);

                }
            }
        }

    }

    // draw a piece to the board

    Piece.prototype.draw = function () {
        this.fill(this.color);
    }

    //undraw a piece

    Piece.prototype.undraw = function () {
        this.fill(VACANT);
    }


    // move down the piece

    Piece.prototype.moveDown = function () {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.undraw();
            this.y++;
            this.draw();

        } else {
            // we lock the piece and generate new one
            this.lock();
            p = randomPiece();
        }

    }

    // move Right the piece
    Piece.prototype.moveRight = function () {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.undraw();
            this.x++;
            this.draw();

        }

    }

    // move Left the piece
    Piece.prototype.moveLeft = function () {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.undraw();
            this.x--;
            this.draw();

        }
    }

    // Rotate the piece

    Piece.prototype.rotate = function () {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let kick = 0;

        if (this.collision(0, 0, nextPattern)) {
            if (this.x > COL / 2) {
                // it's the right wall
                kick = -1; // we need to move the piece to the left
            } else {
                //it's the left wall

                kick = 1 // // we need to move the piece to the right
            }
        }


        if (!this.collision(kick, 0, nextPattern)) {
            this.undraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();

        }
    }



    Piece.prototype.lock = function () {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                //we skip the vacant squares
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                // pieces to lock on top = game over
                if (this.y + r < 0) {
                    gameOverMenu.style.display = "block";
                    checkHighscore();

                    //  stop request animation frame
                    gameOver = true;
                    break;
                }
                // we lock the piece
                board[this.y + r][this.x + c] = this.color;
            }
        }



        //remove full rows
        for (r = 0; r < ROW; r++) {
            let isRowFull = true;
            for (c = 0; c < COL; c++) {
                isRowFull = isRowFull && (board[r][c] != VACANT);
            }
            if (isRowFull) {
                //if the row is full
                //we move down all the rows above it
                for (y = r; y > 1; y--) {
                    for (c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }
                //the top row board[0][...] has no row above it
                for (c = 0; c < COL; c++) {
                    board[0][c] = VACANT;
                }
                // increment the score
                score += 10;
                checkHighscore();
            }
        }

        //update the board
        drawBoard();

        //update the score
        scoreElement.innerHTML = score;
    }

    // collision function

    Piece.prototype.collision = function (x, y, piece) {

        for (r = 0; r < piece.length; r++) {
            for (c = 0; c < piece.length; c++) {
                //if the square is empty, we skip it
                if (!piece[r][c]) {
                    continue;
                }
                //coordinates of the piece after the movement
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                //conditions
                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }
                //skip newY < =; board[-1] will crush the game
                if (newY < 0) {
                    continue;
                }
                //check if there is a locked piece already in place
                if (board[newY][newX] != VACANT) {
                    return true;
                }
            }
        }
        return false;
    }

    // Control piece
    document.addEventListener('keydown', CONTROL, false);

    function CONTROL(event) {
        // With prevent default the arrow keys and spacebar don't scroll like they usually do

        if (event.keyCode == 37) {
            p.moveLeft();
            event.preventDefault();
        } else if (event.keyCode == 38) {
            p.rotate();
            event.preventDefault();
        } else if (event.keyCode == 39) {
            p.moveRight();
            event.preventDefault();
        } else if (event.keyCode == 40) {
            p.moveDown();
            event.preventDefault();
        } else if (event.keyCode == 32) {
            event.preventDefault();
            ///make it so when I press space bar after pausing the pause menu disappears and the game continues same as clicking on the coninue button
            if (pauseMode == false) {
                pauseMode = true;
                pauseAction();
            } else if (pauseMode == true) {
                pauseMode = false;
                continueGame();
            }
        }
    }

    // drop the piece every 1 sec

    let dropStart = Date.now();
    let gameOver = false;


    function drop() {
        if (pause == true) {
            return;
        }
        let now = Date.now();
        let delta = now - dropStart;
        let increase = 1000


        if (hardMode == false) {
            increase = 1000;


            if (score > 90 && score < 200) {
                increase = 900;
                level = 2;
                levelElement.innerHTML = level;

            } else if (score > 190 && score < 300) {
                increase = 800;
                level = 3;
                levelElement.innerHTML = level;
            } else if (score > 290 && score < 400) {
                increase = 700;
                level = 4;
                levelElement.innerHTML = level;
            } else if (score > 390 && score < 500) {
                increase = 600;
                level = 5;
                levelElement.innerHTML = level;
            } else if (score > 490) {
                increase = 500;
                level = 6;
                levelElement.innerHTML = level;
            }

        } else if (hardMode == true) {

            increase = 800;


            if (score > 90 && score < 200) {
                increase = 700;
                level = 2;
                levelElement.innerHTML = level;

            } else if (score > 190 && score < 300) {
                increase = 600;
                level = 3;
                levelElement.innerHTML = level;
            } else if (score > 290 && score < 400) {
                increase = 500;
                level = 4;
                levelElement.innerHTML = level;
            } else if (score > 390 && score < 500) {
                increase = 400;
                level = 5;
                levelElement.innerHTML = level;
            } else if (score > 490) {
                increase = 300;
                level = 6;
                levelElement.innerHTML = level;
            }
        }

        if (delta > increase) {
            p.moveDown();
            dropStart = Date.now();
        }

        if (!gameOver) {
            requestAnimationFrame(drop);
        }
    }


    // Created a function for the highscore, so far is working

    function checkHighscore() {
        if (highscore !== null) {
            if (score > highscore) {
                localStorage.setItem("highscore", score);
            }
        } else {
            localStorage.setItem("highscore", score);
        }
    }

    /// Start the game
    startElement.addEventListener("click", startGame, false);

    function startGame() {
        drop();
        startMenu.style.display = "none"
    }

    ///Pause function
    function pauseAction() {

        pause = true;
        pauseMenu.style.display = "block";
    }

    /// Continue Paused Game
    continueElement.addEventListener("click", continueGame, false);

    function continueGame() {
        pause = false;
        drop()
        pauseMenu.style.display = "none"
    }

    /// Restart Current game
    restartElement.addEventListener("click", restartGame, false);

    function restartGame() {
        pauseMenu.style.display = "none"
        location.reload();
    }

    /// Try Again Button
    tryAgainElement.addEventListener("click", tryAgain, false)

    function tryAgain() {

        location.reload();
    }

    // selecting difficulty

    normalElement.addEventListener("click", normalDif, false)

    hardElement.addEventListener("click", hardDif, false)

    function normalDif() {
        hardMode = false;
        normalElement.style.backgroundColor = 'green';
        hardElement.style.backgroundColor = '';
    }

    function hardDif() {
        hardMode = true;
        hardElement.style.backgroundColor = 'red';
        normalElement.style.backgroundColor = '';
    }
}