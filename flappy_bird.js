
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let img = new Image();
img.src = 'image.png';

let ter_img = new Image();
ter_img.src = 'ter.png';

let zam_sound = new Audio("zam.mpeg");
zam_sound.preload = "auto";
zam_sound.load()

// let ter_sound = new Audio("ter.wav");
// ter_sound.preload = "auto";
// ter_sound.load()

class Bird {
  constructor() {
    this.x = canvas.width / 4;
    this.y = canvas.height / 2;
    this.radius = 10;
    this.velocity = 0;
    this.gravity = 0.2;
    this.lift = -4.5;
  }

  draw() {
    ctx.drawImage(img, this.x, this.y);
    ctx.fill();
    ctx.stroke();
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y >= canvas.height - this.radius) {
      this.y = canvas.height - this.radius;
      this.velocity = 0;
    }

    if (this.y <= this.radius) {
      this.y = this.radius;
      this.velocity = 0;
    }
  }

  flap() {
    this.velocity += this.lift;
  }
}

class Pipe {
  constructor() {
    this.topHeight = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.1);
    this.bottomHeight = canvas.height - this.topHeight - 100;
    this.x = canvas.width;
    this.width = 50;
    this.speed = 2;
  }

  draw() {
    // Draw top pipe
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, 0, this.width, this.topHeight);

    // Draw bottom pipe
    ctx.fillRect(this.x, canvas.height - this.bottomHeight, this.width, this.bottomHeight);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x + this.width < 0;
  }
}

function checkCollision(bird, pipe) {
  const birdTop = bird.y - bird.radius + 10;
  const birdBottom = bird.y + bird.radius;
  const birdLeft = bird.x - bird.radius;
  const birdRight = bird.x + bird.radius;

  const pipeTop = pipe.topHeight;
  const pipeBottom = canvas.height - pipe.bottomHeight;
  const pipeLeft = pipe.x;
  const pipeRight = pipe.x + pipe.width;

  const isCollidingTop = birdTop <= pipeTop && (birdRight >= pipeLeft && birdLeft <= pipeRight);
  const isCollidingBottom = birdBottom >= pipeBottom && (birdRight >= pipeLeft && birdLeft <= pipeRight);

  return isCollidingTop || isCollidingBottom;
}

const bird = new Bird();
const pipes = [];
let gameOver = false;

function addPipe() {
  pipes.push(new Pipe());
}

function drawPipes() {
  for (const pipe of pipes) {
    pipe.draw();
  }
}

function updatePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].update();
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
      i--;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.draw();
  drawPipes();

  if (gameOver) {
    ctx.drawImage(ter_img, canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 200);
    ctx.fill();
    ctx.stroke();
  }
}

function update() {
  bird.update();
  updatePipes();

  for (const pipe of pipes) {
    if (checkCollision(bird, pipe)) {
      gameOver = true;
      break;
    }
  }
}

function loop() {
  if (!gameOver) {
    update();
  }
  draw();
  requestAnimationFrame(loop);
}

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes.length = 0;
  gameOver = false;
}

canvas.addEventListener('click', (_) => {
  if (gameOver) {
    resetGame();
    // ter_sound.play();
  } else {
    bird.flap();
    zam_sound.play();
  }
});

setInterval(addPipe, 2000); // Add a new pipe every 2 seconds
loop();
