document.addEventListener('DOMContentLoaded', init, false);

function init() {

    // Selecting the canvas
    let can = document.getElementById('table');
    let draw_ = can.getContext('2d');
    //getContext is use to draw anything on a canvas element

    let startElement = document.getElementById("start");
    let continueElement = document.getElementById("continue");
    let restartElement = document.getElementById("restart");
    let tryAgainElement = document.getElementById("try_again");
    let pauseMenu = document.getElementById("Pause_menu");
    let startMenu = document.getElementById("Start_menu");
    let gameOverMenu = document.getElementById("gameOverMenu");
    let pause = false;
    let start = false;

    let normalElement = document.getElementById("normal");
    let hardElement = document.getElementById("hard");

    let hardMode = false;

    let highscoreElement = document.getElementById("highscore");
    var highscore = localStorage.getItem("highscorePong");
    highscoreElement.innerHTML = highscore;

    let pauseMode = false;


    const user = {
        x: 10,
        y: (can.height - 100) / 2,
        width: 10,
        height: 100,
        score: 0,
        color: "white"
    }

    const cpu = {
        x: can.width - 20,
        y: (can.height - 100) / 2,
        width: 10,
        height: 100,
        score: 0,
        color: "white"
    }

    const ball = {
        x: can.width / 2,
        y: can.height / 2,
        radius: 10,
        velX: 5, //velocity in the x direction
        velY: 5, //velocity in the y direction
        speed: 5,
        color: "white"
    }

    //Fuction declaration to draw the rectangle
    function drawRectangle(x, y, w, h, color) {
        draw_.fillStyle = color;
        draw_.fillRect(x, y, w, h);
    }

    const separator = {
        x: (can.width - 2) / 2,
        y: 0,
        height: 10,
        width: 2,
        color: "white"
    }

    // Function separator
    function drawSeparator() {
        for (let i = 0; i <= can.height; i += 20) {
            drawRectangle(separator.x, separator.y + i, separator.width, separator.height, separator.color)
        }
    }

    // Fuction declaration to draw the circle
    function drawCircle(x, y, r, color) {
        draw_.fillStyle = color;
        draw_.beginPath();
        draw_.arc(x, y, r, 0, Math.PI * 2, false);
        draw_.closePath();
        draw_.fill();
    }


    //Fuction declaration to draw the score
    function drawScore(text, x, y, color) {
        draw_.fillStyle = "white";
        draw_.font = "60px monospace";
        draw_.fillText(text, x, y);
    }

    //render the game
    function render() {
        //clear the canvas
        drawRectangle(0, 0, can.width, can.height, "black");

        // draw the separator
        drawSeparator();

        // draw score
        drawScore(user.score, can.width / 4, can.height / 5, "white");
        drawScore(cpu.score, 3 * can.width / 4, can.height / 5, "white");

        //draw the user and the paddle
        drawRectangle(user.x, user.y, user.width, user.height, user.color);
        drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);

        //draw the ball
        drawCircle(ball.x, ball.y, ball.radius, ball.color);
    }

    //control the user paddle
    can.addEventListener('mousemove', movePaddle);

    function movePaddle(evt) {
        let rect = can.getBoundingClientRect();
        user.y = evt.clientY - rect.top - user.height / 2;
    }

    var keys = {};
    window.addEventListener('keydown', function (e) {
        keys[e.keyCode] = true;
        e.preventDefault();
    });
    window.addEventListener('keyup', function (e) {
        delete keys[e.keyCode];
    });

    //collision detection
    function collision(b, p) {
        b.top = b.y - b.radius;
        b.bottom = b.y + b.radius;
        b.left = b.x - b.radius;
        b.right = b.x + b.radius;

        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width;

        return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
    }

    //reset ball
    function resetBall() {
        ball.x = can.width / 2;
        ball.xy = can.height / 2;

        ball.speed = 5;
        ball.velX = -ball.velX;
    }

    //update: pos, mov, score, ..
    function update() {


        /// Check for game over
        if (cpu.score > 4) {
            checkHighscore();
            gameOverMenu.style.display = "block";

            return;
        }
        /// Pause Game
        if (pause == true) {
            return;
        }
        ball.x += ball.velX;
        ball.y += ball.velY;

        //simple AI to control the cpu paddle
        let computerLevel = 0.1;
        cpu.y += (ball.y - (cpu.y + cpu.height / 2)) * computerLevel;

        if (ball.y + ball.radius > can.height || ball.y - ball.radius < 0) {
            ball.velY = -ball.velY;
        }

        let player = (ball.x < can.width / 2) ? user : cpu;

        if (collision(ball, player)) {
            // where the ball hit the player
            let collidePoint = ball.y - (player.y + player.height / 2);

            //normalization
            collidePoint = collidePoint / (player.height / 2);

            //calculate angle in radian
            let angleRad = collidePoint * Math.PI / 4;

            // X direction of the ball when it's hit
            let direction = (ball.x < can.width / 2) ? 1 : -1;

            //change vel X and Y
            ball.velX = direction * ball.speed * Math.cos(angleRad);
            ball.velY = ball.speed * Math.sin(angleRad);

            //everytime the ball hit a paddle, we encrese its speed
            ball.speed += 0.2;

            if (hardMode == false) {
                ball.speed += 0.2;
            } else if (hardMode == true) {
                ball.speed += 0.5
            }
        }

        //update score
        if (ball.x - ball.radius < 0) {
            //the cpu win
            cpu.score++;
            resetBall();
        } else if (ball.x + ball.radius > can.width) {
            //when the user scores the user win
            user.score++;
            resetBall();
        }
    }

    //Game 
    function game() {
        if (start == true) {
            update()
        }

        render();
    }

    //loop for the movements
    const framePerSecond = 50;
    setInterval(game, 1000 / framePerSecond);

    /// Controlling with the Arrow Keys, it's slow but working
    addEventListener('keydown', control, false);

    function control(event) {
        if (event.keyCode == 38) {
            user.y--; //Move up
        }
        if (event.keyCode == 40) {
            user.y++; //Movin Down
        }
    }

    //Prevent arrow keys to scroll up and down the page

    document.addEventListener('keydown', noScroll, false);

    function noScroll(event) {
        if (event.keyCode == 37) {
            event.preventDefault();
        } else if (event.keyCode == 38) {
            event.preventDefault();
        } else if (event.keyCode == 39) {
            event.preventDefault();
        } else if (event.keyCode == 40) {
            event.preventDefault();
        } else if (event.keyCode == 32) {

            event.preventDefault();

            if (pauseMode == false) {
                pauseMode = true;
                pauseAction();
            } else if (pauseMode == true) {
                pauseMode = false;
                continueGame();
            }
        }

    }

    // Created a function for the highscore, is working so far

    function checkHighscore() {
        if (highscore !== null) {
            if (user.score > highscore) {
                localStorage.setItem("highscorePong", user.score);
            }
        } else {
            localStorage.setItem("highscorePong", user.score);
        }
    }

    /// Start the game
    startElement.addEventListener("click", startGame, false);

    function startGame() {
        start = true;
        startMenu.style.display = "none";
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
        update();
        pauseMenu.style.display = "none";
    }

    /// Restart Current game
    restartElement.addEventListener("click", restartGame, false);

    function restartGame() {
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
