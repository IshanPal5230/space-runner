const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const finalScoreElement = document.getElementById("finalScore");

const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");

let gameRunning = true;

let score = 0;
let enemySpeed = 4;

const keys = {};

const player = {
    width: 50,
    height: 50,

    x: canvas.width / 2 - 25,
    y: canvas.height - 80,

    speed: 7,

    color: "#00e5ff"
};

const enemies = [];

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function drawPlayer() {

    ctx.fillStyle = player.color;

    ctx.beginPath();

    ctx.moveTo(player.x + player.width / 2, player.y);

    ctx.lineTo(player.x, player.y + player.height);

    ctx.lineTo(player.x + player.width, player.y + player.height);

    ctx.closePath();

    ctx.fill();
}

function movePlayer() {

    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        player.x += player.speed;
    }

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function spawnEnemy() {

    const size = Math.random() * 30 + 30;

    enemies.push({
        x: Math.random() * (canvas.width - size),
        y: -size,

        width: size,
        height: size,

        color: "red"
    });
}

function drawEnemies() {

    enemies.forEach((enemy) => {

        ctx.fillStyle = enemy.color;

        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );
    });
}

function moveEnemies() {

    enemies.forEach((enemy, index) => {

        enemy.y += enemySpeed;

        if (enemy.y > canvas.height) {

            enemies.splice(index, 1);

            score++;

            scoreElement.textContent = score;

            if (score % 5 === 0) {
                enemySpeed += 0.5;
            }
        }
    });
}

function checkCollision() {

    enemies.forEach((enemy) => {

        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            endGame();
        }
    });
}

function drawStars() {

    for (let i = 0; i < 100; i++) {

        ctx.fillStyle = "white";

        ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2,
            2
        );
    }
}

function gameLoop() {

    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStars();

    movePlayer();

    drawPlayer();

    moveEnemies();

    drawEnemies();

    checkCollision();

    requestAnimationFrame(gameLoop);
}

function enemySpawner() {

    if (!gameRunning) return;

    spawnEnemy();

    const spawnRate = Math.max(
        300,
        1000 - score * 10
    );

    setTimeout(enemySpawner, spawnRate);
}

function endGame() {

    gameRunning = false;

    finalScoreElement.textContent = score;

    gameOverScreen.classList.remove("hidden");
}

function restartGame() {

    enemies.length = 0;

    score = 0;

    enemySpeed = 4;

    scoreElement.textContent = score;

    player.x = canvas.width / 2 - 25;

    gameRunning = true;

    gameOverScreen.classList.add("hidden");

    gameLoop();

    enemySpawner();
}

restartBtn.addEventListener(
    "click",
    restartGame
);

gameLoop();

enemySpawner();
