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

const winModal = document.querySelector('.win-modal');
const gameOverModal = document.querySelector('.game-over-modal');
const avatarModal = document.querySelector('.avatar-modal');

const keyIcon = document.querySelector('.key-icon');
const score = document.querySelector('.score');

const avatarButton = document.querySelector('.avatar');
const avatarBoyButton = document.querySelector('.boy');
const avatarCatGirlButton = document.querySelector('.cat-girl');
const avatarHornGirlButton = document.querySelector('.horn-girl');
const avatarPinkGirlButton = document.querySelector('.pink-girl');
const avatarPrincessButton = document.querySelector('.princess');
const cancelButton = document.querySelector('.cancel-button');
const restartButton = document.querySelector('.restart-icon');
const newGameButton = document.querySelector('.new-game-button');

let character = 'images/char-boy.png';

let  allEnemies = [];
let player;



/*
*
* ENEMY CLASS
*
*/

// Enemies the player must avoid
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


// Reset enemy location & speed
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
    this.sprite = character;
    this.spriteWidth = 66;
    this.spriteHeight = 75;
    this.x = x;
    this.y = y;
    this.lives = 3;
    this.key = false;
    this.gemOrange = false;
    this.gemGreen = false;
    this.gemBlue = false;
    this.tempScore = 0;
    this.score = 0;
    this.canMove = true;
};


// Update the player's position
Player.prototype.update = function() {
  score.innerHTML = this.score;
};


// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Handle keyboard input for the player
Player.prototype.handleInput = function(key) {
  if (this.canMove){
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
    }
};


// Decrease lives and reset player when they die
Player.prototype.die = function() {
    this.lives--;
    removeHeart();

    if (this.lives == 0){
      showGameOverModal();
    }
    this.reset();
};


// Incread score and reset player when they reach the win portal
Player.prototype.win = function() {

  winModal.style.display = 'block';

  // Prevent player from moving while modal open
  player.canMove = false;

  const that = this;
  setTimeout(function () {
    that.reset();
  }, 1800);

  setTimeout(function () {
    winModal.style.display = 'none';
    player.canMove = true;
  }, 2000);
};


// Reset the player location, items, and score
Player.prototype.reset = function() {
    this.x = PLAYER_START_X * COL_FACTOR;
    this.y = PLAYER_START_Y * ROW_FACTOR;

    removeKey();
    removeGems();

    player.tempScore = 0;
}



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

// Setup a new game
function newGame(){
  allEnemies = [new Enemy(ENEMY_START_LOC, 61, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH)),
                       new Enemy(ENEMY_START_LOC, 144, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH)),
                       new Enemy(ENEMY_START_LOC, 227, getRandomArbitrary(RAND_SPEED_LOW , RAND_SPEED_HIGH))];

  player = new Player(PLAYER_START_X * COL_FACTOR, PLAYER_START_Y * ROW_FACTOR);

  player.reset();

  // Draw avatar button on scoreboard
  avatarButton.src = player.sprite;

  player.score = 0;

  gameOverModal.style.display = 'none';
}


// Reveal the game over modal
function showGameOverModal(){
  getResultScore();
  gameOverModal.style.display = 'block';

  // Prevent player from moving while modal open
  player.canMove = false;
}


// Get the total time it took the user to play the game
function getResultScore(){
  let scoreResult = document.querySelector('.score-result');
  scoreResult.textContent = player.score;
}


/* ------------------------ Score Pannel ------------------------*/

// Remove a heart from the score pannel
function removeHeart(){
  const heart = document.querySelector('.fa-heart');
  if (heart != undefined){
    heart.classList.remove('fa-heart');
    heart.classList.add('fa-heart-o');
  }
}


// Add back all hearts to the score pannel
function resetHearts(){
  const maxHearts = 3;
  const heartsNeeded = (maxHearts - player.lives);
  for (let i = 0; i < heartsNeeded; i++){
    addHeart();
  }
}


// Add back a heart to the score pannel
function addHeart(){
  const heart = document.querySelector('.fa-heart-o');
  heart.classList.remove('fa-heart-o');
  heart.classList.add('fa-heart');
}


// "Grey-out" the key on the score pannel
function removeKey(){
  if (player.key == true){
    keyIcon.classList.remove('found');
    player.key = false;
  }
}


// Remove all gems from player's inventory
function removeGems(){
  player.gemOrange = false;
  player.gemGreen = false;
  player.gemBlue = false;
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


// Display change character/avatar window
avatarButton.addEventListener('click', function() {
    avatarModal.style.display = 'block';

    // Prevent player from moving while modal open
    player.canMove = false;
});


// Change character/avatar
avatarBoyButton.addEventListener('click', function() {
    player.sprite = 'images/char-boy.png';
    character = player.sprite;
    avatarButton.src = player.sprite;
    avatarModal.style.display = 'none';
    player.canMove = true;
});


// Change character/avatar
avatarCatGirlButton.addEventListener('click', function() {
    player.sprite = 'images/char-cat-girl.png';
    character = player.sprite;
    avatarButton.src = player.sprite;
    avatarModal.style.display = 'none';
    player.canMove = true;
});


// Change character/avatar
avatarHornGirlButton.addEventListener('click', function() {
    player.sprite = 'images/char-horn-girl.png';
    character = player.sprite;
    avatarButton.src = player.sprite;
    avatarModal.style.display = 'none';
    player.canMove = true;
});


// Change character/avatar
avatarPinkGirlButton.addEventListener('click', function() {
    player.sprite = 'images/char-pink-girl.png';
    character = player.sprite;
    avatarButton.src = player.sprite;
    avatarModal.style.display = 'none';
    player.canMove = true;
});


// Change character/avatar
avatarPrincessButton.addEventListener('click', function() {
    player.sprite = 'images/char-princess-girl.png';
    character = player.sprite;
    avatarButton.src = player.sprite;
    avatarModal.style.display = 'none';
    player.canMove = true;
});


// Close out of new character/avatar window
cancelButton.addEventListener('click', function() {
    avatarModal.style.display = 'none';
    player.canMove = true;
});


// Reset game
restartButton.addEventListener('click', function() {
    resetHearts();
    newGame();
});


// Reset game
newGameButton.addEventListener('click', function() {
    resetHearts();
    newGame();
});
