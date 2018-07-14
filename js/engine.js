/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on player and enemy objects (defined in app.js).
 */

var Engine = (function(global) {
     const WIN_PORTAL_X = 202;
     const WIN_PORTAL_Y = -20.75;

     const itemLocX = [0, 101, 202, 303, 404];
     const itemLocY = [41.5, 124.5, 207.5];

     let gemOrangeX = itemLocX[getRandomInt(0, 4)];
     let gemOrangeY = itemLocY[getRandomInt(0, 2)];
     let gemGreenX = itemLocX[getRandomInt(0, 4)];
     let gemGreenY = itemLocY[getRandomInt(0, 2)];
     let gemBlueX = itemLocX[getRandomInt(0, 4)];
     let gemBlueY = itemLocY[getRandomInt(0, 2)];
     let keyX = itemLocX[getRandomInt(0, 4)];
     let keyY = itemLocY[getRandomInt(0, 2)];

     let gemOrangeCount = 0;
     let gemGreenCount = 0;
     let gemBlueCount = 0;
     let keyCount = 0;

     let hideItems = false;

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        canvasContainer = doc.querySelector('.game'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    canvas.classList.add('canvas');
    canvasContainer.appendChild(canvas);



    // Handles properly calling the update and render methods
    function main() {
        // Smooth animation regardless of computer using time delta
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        lastTime = now;

        // Call this function again when the browser can draw another frame
        win.requestAnimationFrame(main);
    }


    // Initial setup
    function init() {
        lastTime = Date.now();
        main();
    }


    // Call all functions which may need to update an entity's data
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkForWin();
    }


    // Update enemies and player data/properties
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }


    // Check to see if the player has collided with an enemy or item
    function checkCollisions() {
      // Kill player if collision with an enemy
      allEnemies.forEach(function(enemy) {
        if (isCollision((player.x + 17.5), (player.y + 64.5), player.spriteWidth, player.spriteHeight,
                        (enemy.x + 2.5), (enemy.y + 78), enemy.spriteWidth, enemy.spriteHeight)){
              player.score -= player.tempScore;

              player.die();
              resetItemCounts();

              // Change location of the items when game over
              if (player.lives == 0){
                changeItemLoc();
              }
        }
      });


      // Give player key if collision
      if (isCollision((player.x + 17.5), (player.y + 64.5), player.spriteWidth, player.spriteHeight,
                      (keyX + 30), (keyY + 95), 43, 46)){
            player.key = true;

            // Only increase the score once during the frames the player is colliding
            if (keyCount == 0){
              increaseScores(2);
              keyCount++;
            }

            const keyIcon = document.querySelector('.key-icon');
            keyIcon.classList.add('found');
      }


      //Orange Gem: Increase score if player collides with gem
      if (isCollision((player.x + 17.5), (player.y + 64.5), player.spriteWidth, player.spriteHeight,
                      (gemOrangeX  + 3), (gemOrangeY + 105), 95, 57)){
            player.gemOrange = true;

            // Only increase the score once during the frames the player is colliding
            if (gemOrangeCount == 0){
              increaseScores(1);
              gemOrangeCount++;
            }
      }


      //Green Gem: Increase score if player collides with gem
      if (isCollision((player.x + 17.5), (player.y + 64.5), player.spriteWidth, player.spriteHeight,
                      (gemGreenX  + 3), (gemGreenY + 105), 95, 57)){
            player.gemGreen = true;

            // Only increase the score once during the frames the player is colliding
            if (gemGreenCount == 0){
              increaseScores(1);
              gemGreenCount++;
            }
      }


      //Blue Gem: Increase score if player collides with gem
      if (isCollision((player.x + 17.5), (player.y + 64.5), player.spriteWidth, player.spriteHeight,
                      (gemBlueX  + 3), (gemBlueY + 105), 95, 57)){
            player.gemBlue = true;

            // Only increase the score once during the frames the player is colliding
            if (gemBlueCount == 0){
              increaseScores(1);
              gemBlueCount++;
            }
      }
    }


    //Collision detection function modified from:
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    function isCollision(aLocX, aLocY, aWidth, aHeight, bLocX, bLocY, bWidth, bHeight ){
      if (aLocX < (bLocX + bWidth) &&
          (aLocX + aWidth) > bLocX &&
          aLocY  < (bLocY + bHeight) &&
          (aHeight + aLocY) > bLocY){
        return true;
      }else{
        return false;
      }
    }


    // Increase all score tracking variables by parameter passed in
    function increaseScores(val){
      player.score += val;
      player.tempScore += val;
    }


    // Allow scores/key to be increased/collected again if player collides with an item
    function resetItemCounts(){
      gemOrangeCount = 0;
      gemGreenCount = 0;
      gemBlueCount = 0;
      keyCount = 0;
    }


    // If player is on winning portal with key, change item location, and reset the game
    function checkForWin(){
      if (player.x == WIN_PORTAL_X && player.y == WIN_PORTAL_Y && player.key == true){
        setTimeout(function() {
          player.win();
        }, 200);

        // Keep items hidden while changing location (items will change locations
        // for several frames and look glitchy otherwise)
        hideItems = true;
        changeItemLoc();
        resetItemCounts();

      }else{
        hideItems = false;
      }
    }


    // Randomly generate new coordinates for items within propper bounds
    function changeItemLoc() {
      keyX = itemLocX[getRandomInt(0, 4)];
      keyY = itemLocY[getRandomInt(0, 2)];

      gemOrangeX = itemLocX[getRandomInt(0, 4)];
      gemOrangeY = itemLocY[getRandomInt(0, 2)];

      gemGreenX = itemLocX[getRandomInt(0, 4)];
      gemGreenY = itemLocY[getRandomInt(0, 2)];

      gemBlueX = itemLocX[getRandomInt(0, 4)];
      gemBlueY = itemLocY[getRandomInt(0, 2)];
    }


    //Returns a random integer between min (inclusive) and max (inclusive)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    // Draws the "game level", then calls renderEntities
    function render() {
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        // Draw gameboard tiles
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        // Draw win portal
        ctx.drawImage(Resources.get('images/selector.png'), 202, -41.5);

        // Draw gem items
        if (player.gemOrange == false && hideItems == false){
          ctx.drawImage(Resources.get('images/gem-orange.png'), gemOrangeX, gemOrangeY);
        }
        if (player.gemGreen == false && hideItems == false){
          ctx.drawImage(Resources.get('images/gem-green.png'), gemGreenX, gemGreenY);
        }
        if (player.gemBlue == false && hideItems == false){
          ctx.drawImage(Resources.get('images/gem-blue.png'), gemBlueX, gemBlueY);
        }

        // Draw key item
        if (player.key == false && hideItems == false){
          ctx.drawImage(Resources.get('images/key.png'), keyX, keyY);
        }
        renderEntities();
    }


    // Call render functions defined for enemies and player classes in app.js
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }


    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/selector.png',
        'images/key.png',
        'images/gem-orange.png',
        'images/gem-green.png',
        'images/gem-blue.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
