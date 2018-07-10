/*
*
* GLOBAL VARIABLES
*
*/

const ROW_FACTOR = 83;
const COL_FACTOR = 101;

const UP_BOUND = -20.75;
const DOWN_BOUND = 456;
const LEFT_BOUND = 0;
const RIGHT_BOUND = 404;

const WIN_PORTAL_X = 202;
const WIN_PORTAL_Y = -20.75;

const ENEMY_START_LOC = -101;
const ENEMY_END_LOC = 505;

const PLAYER_START_X = 2;
const PLAYER_START_Y = 4.75;

const RAND_SPEED_LOW = 100;
const RAND_SPEED_HIGH = 500;

const winModal = document.querySelector('.win-modal');
const gameOverModal = document.querySelector('.game-over-modal');

let  allEnemies = [];
let player;

let score = 0;

/*
*
* ENEMY CLASS
*
*/

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.spriteWidth = 96;
    this.spriteHeight = 65;
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position
Enemy.prototype.update = function(dt) {
    //move the Enemy at constant speed across all browsers
    this.x += this.speed * dt;

    //loop enemies across the screen
    if (this.x > ENEMY_END_LOC){
      this.reset();
    }
};

// Reset the player
Enemy.prototype.reset = function() {
  this.x = ENEMY_START_LOC;
  this.speed = getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH);
};

// Random number generator (between two numbers) function from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*
*
* PLAYER CLASS
*
*/

// The player the user controls
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.spriteWidth = 66;
    this.spriteHeight = 75;
    this.x = x;
    this.y = y;
    this.key = false;
    this.lives = 3;
};

// Update the player's position
Player.prototype.update = function() {
    // Show win modal if player reaches portal with key & reset player to start
    if (this.x == WIN_PORTAL_X && this.y == WIN_PORTAL_Y && player.key == true){
      const that = this;
      setTimeout(function () {
        that.win();
      }, 200);
    }
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle keyboard input for the player
Player.prototype.handleInput = function(key) {
    switch(key) {
    case 'left':
      if ((this.x - COL_FACTOR) >= LEFT_BOUND){
        this.x -= COL_FACTOR;
      }
      break;
    case 'up':
      if ((this.y - ROW_FACTOR) >= UP_BOUND){
        this.y -= ROW_FACTOR;
      }
      break;
    case 'right':
      if ((this.x + COL_FACTOR) <= RIGHT_BOUND){
        this.x += COL_FACTOR;
      }
      break;
    case 'down':
      if ((this.y + ROW_FACTOR) < DOWN_BOUND){
        this.y += ROW_FACTOR;
      }
      break;
    }
};

// Decrease lives and reset player when they die
Player.prototype.die = function() {
    this.lives--;
    removeHeart();
    this.reset();
    if (this.lives == 0){
      showGameOverModal();
    }
};

// Incread score and reset player when they reach the exit
Player.prototype.win = function() {
  winModal.style.display = 'block';

  const that = this;
  setTimeout(function () {
    that.reset();
  }, 1800);

  setTimeout(function () {
    winModal.style.display = 'none';
  }, 2000);
};

// Reset the player
Player.prototype.reset = function() {
    this.x = PLAYER_START_X * COL_FACTOR;
    this.y = PLAYER_START_Y * ROW_FACTOR;

    if (player.key == true){
      const keyIcon = document.querySelector('.key-icon');
      keyIcon.classList.remove('found');
      player.key = false;
    }
};


/*
*
* GAMEPLAY
*
*/

newGame();


/*
*
* FUNCTIONS
*
*/

/* ------------------------ Gameplay ------------------------*/

// Reset game
function newGame(){
  allEnemies = [new Enemy(ENEMY_START_LOC, 61, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH)),
                       new Enemy(ENEMY_START_LOC, 144, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH)),
                       new Enemy(ENEMY_START_LOC, 227, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH))];

  player = new Player(PLAYER_START_X * COL_FACTOR, PLAYER_START_Y * ROW_FACTOR);

  // Draw avatar button on scoreboard
  const avatar = document.querySelector('.avatar');
  avatar.src = player.sprite;

  score = 0;

  gameOverModal.style.display = 'none';
}

function showGameOverModal(){
  getResultScore();
  gameOverModal.style.display = 'block';
}


// Get the total time it took the user to play the game
function getResultScore(){
  let score = document.querySelector('.score');
  let scoreResult = document.querySelector('.score-result');
  scoreResult.textContent = score.textContent;
}


/* ------------------------ Score Pannel ------------------------*/

function removeHeart(){
  const heart = document.querySelector('.fa-heart');
  heart.classList.remove('fa-heart');
  heart.classList.add('fa-heart-o');
}

function resetHearts(){
  const maxHearts = 3;
  const heartsNeeded = (maxHearts - player.lives);
  for (let i = 0; i < heartsNeeded; i++){
    addHeart();
  }
}

function addHeart(){
  const heart = document.querySelector('.fa-heart-o');
  heart.classList.remove('fa-heart-o');
  heart.classList.add('fa-heart');
}


/*
*
* EVENT LISTENERS
*
*/

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    e.preventDefault();

    player.handleInput(allowedKeys[e.keyCode]);
});

let restartButton = document.querySelector('.restart-icon');
restartButton.addEventListener('click', function() {
    resetHearts();
    newGame();
});

let newGameButton = document.querySelector('.new-game-button');
newGameButton.addEventListener('click', function() {
    resetHearts();
    newGame();
});
