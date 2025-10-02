// Define HTML elements
const board = document.getElementById("game-board");
// Will go through the html document and find that id. Document comes under DOM(Document Object Model) api automatically included in browsers
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Define game variables
const gridsize = 20;
  let snake = [{ x: 10, y: 10 }];
let food = generatefood();
let direction = "left";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = localStorage.getItem("highScore") ? Number(localStorage.getItem("highScore")) : 0;
highScoreText.textContent = highScore.toString().padStart(3, "0");
 highScoreText.style.display = "block";
// Draw game map,snake, food
draw = () => {
  board.innerHTML = " "; // Helps to get or set HTML content. [Here we declaring it null, to clear the stuff present there]
  drawSnake();
  drawfood();
  updateScore();
};

//Draw Snake
drawSnake = () => {
  snake.forEach((segment) => {
    if (gameStarted) {
      const snakeElement = createGameElement("div", "snake");
      setPosition(snakeElement, segment); // setting up the position
      board.appendChild(snakeElement); // Attaching the snake tag created under board(game-board in one sense) to board
    }
  });
};

// Create Snake or food cube
function createGameElement(tag, className) {
  const element = document.createElement(tag); // Here we are creating element[as a tag(div)]
  element.className = className;
  return element;
}

// Set position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x; // Setting the grid value of (div.snake, that is being created)
  element.style.gridRow = position.y;
}

// Draw food function
function drawfood() {
  if (gameStarted) {
    const foodelement = createGameElement("div", "food");
    setPosition(foodelement, food);
    board.appendChild(foodelement);
  }
}

// function to generate food
function generatefood() {
  const x = Math.floor(Math.random() * gridsize) + 1; 
  const y = Math.floor(Math.random() * gridsize) + 1;
  return { x, y };
}
//we add 1 as
//gridColumn and gridRow start from 1 in CSS Grid, not 0.
// That’s why the food coordinates must be between [1, gridsize].

// function to move
function move() {
  const head = { ...snake[0] }; // Using spread operator to create a copy of snake
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generatefood();
    increaseSpeed();
    clearInterval(gameInterval); // clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Start the game function
function startGame() {
  gameStarted = true; // Keep track of running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  snake = [{ x: 10, y: 10 }];
  food = generatefood();
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

//Keypress event  listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
    }
  }
}

document.addEventListener("keydown", handleKeyPress); //In our beloved HTML document, we are adding an event, which listen to keydown(Keyboard instruction) and pass it to handleKeyPress

function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  }
  if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridsize || head.y < 1 || head.y > gridsize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  generatefood();
  direction = "left";
  gameSpeedDelay = 200;
  updateScore();
  document.addEventListener("keydown", handleKeyPress);
  handleKeyPress();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0"); // 001 not  just 1
}
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}



