/*
*
* ENEMY CLASS
*
*/

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //TODO: Update enemy location
    //TODO: Handle collision with the Player
};

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
    this.x = x;
    this.y = y;
};

// Update the player's position
Player.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //TODO: Handle collision with Enemies
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle keyboard input for the player
Player.prototype.handleInput = function(key) {
    const UP_BOUND = -42;
    const DOWN_BOUND = 456;
    const LEFT_BOUND = 0;
    const RIGHT_BOUND = 404;

    switch(key) {
    case 'left':
      if ((this.x - COL_FACTOR) >= LEFT_BOUND){
        this.x -= COL_FACTOR;
      }
      break;
    case 'up':
      if ((this.y - ROW_FACTOR) > UP_BOUND){
        this.y -= ROW_FACTOR;
        //TODO: determine if player reaches water
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

// Reset the player
Player.prototype.reset = function() {
    //TODO: reset player if they reach the water
};


/*
*
* GAMEPLAY
*
*/
const ROW_FACTOR = 83;
const COL_FACTOR = 101;

// var e1 = new Enemy(0 * COL_FACTOR, 0 * ROW_FACTOR, 0);
var e1 = new Enemy(-50, -50, 0);
var allEnemies = [e1];
var player = new Player(2 * COL_FACTOR, 4.5 * ROW_FACTOR, 0);


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
