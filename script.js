const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 10, PADDLE_HEIGHT = 80, BALL_SIZE = 12;
const PLAYER_X = 20, AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6, AI_SPEED = 4;
const BALL_SPEED = 5;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw center line
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = '#fff6';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Update positions
function update() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Ball collision with top/bottom
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballVY = -ballVY;
    ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
  }

  // Ball collision with player paddle
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballVX = Math.abs(ballVX);
    // Add a little angle based on where it hit
    let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballVY = collidePoint * 0.25;
  }

  // Ball collision with AI paddle
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballVX = -Math.abs(ballVX);
    let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballVY = collidePoint * 0.25;
  }

  // AI movement (simple)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
    aiY += AI_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
    aiY -= AI_SPEED;
  }
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));

  // Check for scoring (reset ball)
  if (ballX < 0 || ballX > canvas.width) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
  }
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
