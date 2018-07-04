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
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //TODO: Update player location
    //TODO: Handle collision with Enemies
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle keyboard input for the player
Player.prototype.handleInput = function(key) {
    //TODO: handle key input
    //TODO: prevent player from moving off screen
    //TODO: determine if player reaches water
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

var e1 = new Enemy(0, 0, 0);
var allEnemies = [e1];
var player = new Player(0, 0, 0);


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

    player.handleInput(allowedKeys[e.keyCode]);
});
