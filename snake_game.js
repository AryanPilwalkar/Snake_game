const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const boxSize = 20;
const canvasWidth = 400;
const canvasHeight = 400;

// Set canvas size
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Initialize game variables
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let snake = [{ x: 200, y: 200 }];
let food = generateFood();
let direction = null;
let gameLoop = null;

// Event listeners for keyboard
document.addEventListener('keydown', handleKeyPress);

// Event listeners for buttons
document.getElementById('up-btn').addEventListener('click', () => setDirection('up'));
document.getElementById('down-btn').addEventListener('click', () => setDirection('down'));
document.getElementById('left-btn').addEventListener('click', () => setDirection('left'));
document.getElementById('right-btn').addEventListener('click', () => setDirection('right'));

function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowUp': setDirection('up'); break;
        case 'ArrowDown': setDirection('down'); break;
        case 'ArrowLeft': setDirection('left'); break;
        case 'ArrowRight': setDirection('right'); break;
    }
}

function setDirection(newDirection) {
    if (!gameLoop) startGame();
    
    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };
    
    // Prevent reversing into self
    if (direction && newDirection === opposites[direction]) return;
    direction = newDirection;
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasWidth / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvasHeight / boxSize)) * boxSize
    };
}

function moveSnake() {
    const head = { ...snake[0] };
    
    switch(direction) {
        case 'up': head.y -= boxSize; break;
        case 'down': head.y += boxSize; break;
        case 'left': head.x -= boxSize; break;
        case 'right': head.x += boxSize; break;
    }
    
    // Check for collisions
    if (checkCollision(head)) {
        resetGame();
        return;
    }
    
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highest-score').innerText = 'Highest score: ' + highScore;
        }
        food = generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision(head) {
    // Wall collision
    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        return true;
    }
    
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
    
    // Draw snake
    ctx.fillStyle = 'black';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });
    
    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function gameUpdate() {
    moveSnake();
    drawGame();
}

function startGame() {
    if (!gameLoop) {
        gameLoop = setInterval(gameUpdate, 100);
    }
}

function resetGame() {
    clearInterval(gameLoop);
    gameLoop = null;
    snake = [{ x: 200, y: 200 }];
    direction = null;
    score = 0;
    food = generateFood();
}

// Initial draw
drawGame();
