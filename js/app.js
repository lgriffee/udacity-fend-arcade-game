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

const ENEMY_START_LOC = -101;
const ENEMY_END_LOC = 505;

const PLAYER_START_X = 2;
const PLAYER_START_Y = 4.75;

const RAND_SPEED_LOW = 100;
const RAND_SPEED_HIGH = 500;

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
    // Reset player if they reach the water
    if (this.y <= UP_BOUND){
      const that = this;
      setTimeout(function () {
        that.reset();
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
    this.reset();
    console.log(this.lives);
    if (this.lives == 0){
      showGameOverModal();
    }
};

// Reset the player
Player.prototype.reset = function() {
    this.x = PLAYER_START_X * COL_FACTOR;
    this.y = PLAYER_START_Y * ROW_FACTOR;
};


/*
*
* CREATE PLAYERS
*
*/

const  allEnemies = [new Enemy(ENEMY_START_LOC, 61, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH)),
                     new Enemy(ENEMY_START_LOC, 144, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH)),
                     new Enemy(ENEMY_START_LOC, 227, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH))];

const player = new Player(PLAYER_START_X * COL_FACTOR, PLAYER_START_Y * ROW_FACTOR);

// Draw avatar button on scoreboard
const avatar = document.querySelector('.avatar');
avatar.src = player.sprite;


/*
*
* GAMEOVER
*
*/

function showGameOverModal(){
  const gameOverModal = document.querySelector('.game-over-modal');
  getScore();
  gameOverModal.style.display = 'block';
}

// Get the total time it took the user to play the game
function getScore(){
  let score = document.querySelector('.score');
  let scoreResult = document.querySelector('.score-result');
  scoreResult.textContent = score.textContent;
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
    //TODO: Reset Game
});

let newGameButton = document.querySelector('.new-game-button');
newGameButton.addEventListener('click', function() {
    //TODO: Reset Game
});
