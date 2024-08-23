const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const playerNameInput = document.getElementById('playerName');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('startButton');


let gridSize = 20;
let canvasSize = 400;
let snake = [{ x: gridSize * 2, y: gridSize * 2 }];
let direction = { x: gridSize, y: 0 };
let food = { x: gridSize * 5, y: gridSize * 5 };
let score = 0;
let highScore = 0;
let speed = 200;


function drawCircle(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth=5;
    ctx.strokeStyle='gold';
    ctx.stroke();
    ctx.fillStyle='yellow';
    ctx.fill();
}



function drawSnake() {
    snake.forEach(segment => drawCircle(segment.x, segment.y, 'lime'));
}

function drawFood() {
    drawStar(food.x + gridSize / 2, food.y + gridSize / 2, 5, gridSize / 2, gridSize / 4);
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = highScore;
        }
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

    const goingUp = direction.y === -gridSize;
    const goingDown = direction.y === gridSize;
    const goingRight = direction.x === gridSize;
    const goingLeft = direction.x === -gridSize;

    if (keyPressed === LEFT && !goingRight) {
        direction = { x: -gridSize, y: 0 };
    }

    if (keyPressed === UP && !goingDown) {
        direction = { x: 0, y: -gridSize };
    }

    if (keyPressed === RIGHT && !goingLeft) {
        direction = { x: gridSize, y: 0 };
    }

    if (keyPressed === DOWN && !goingUp) {
        direction = { x: 0, y: gridSize };
    }
}

function checkCollision() {
    const head = snake[0];

    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= canvasSize;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= canvasSize;

    let selfCollision = false;
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            selfCollision = true;
            break;
        }
    }

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || selfCollision;
}

function gameLoop() {
    if (checkCollision()) {
        alert(`Game Over! ${playerNameInput.value}, your score is ${score}`);
        document.location.reload();
    }

    setTimeout(function () {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        moveSnake();
        drawSnake();
        drawFood();
        gameLoop();
    }, speed);
}

startButton.addEventListener('click', () => {
    const difficulty = difficultySelect.value;

    if (difficulty === 'easy') {
        speed = 200;
    } else if (difficulty === 'medium') {
        speed = 150;
    } else {(difficulty === 'hard') 
        speed = 100;
    }

    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    document.addEventListener('keydown', changeDirection);
    gameLoop();
});
