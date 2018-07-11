/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 */


var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
     const WIN_PORTAL_X = 202;
     const WIN_PORTAL_Y = -20.75;

     const itemLocX = [0, 101, 202, 303, 404];
     const itemLocY = [41.5, 124.5, 207.5];

     let gemOrangeX = itemLocX[getRandomInt(0, 4)];
     let gemOrangeY = itemLocY[getRandomInt(0, 2)];
     let gemOrangeCount = 0;

     let gemGreenX = itemLocX[getRandomInt(0, 4)];
     let gemGreenY = itemLocY[getRandomInt(0, 2)];
     let gemGreenCount = 0;

     let gemBlueX = itemLocX[getRandomInt(0, 4)];
     let gemBlueY = itemLocY[getRandomInt(0, 2)];
     let gemBlueCount = 0;

     let keyX = itemLocX[getRandomInt(0, 4)];
     let keyY = itemLocY[getRandomInt(0, 2)];
     let keyCount = 0;

     let dieCount = 0;

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

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkForWin();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }


    function checkCollisions() {
      allEnemies.forEach(function(enemy) {
        // if (isCollision((player.x + 17.5), (player.y + 64.5), player.spriteWidth, player.spriteHeight,
        //                            (enemy.x + 2.5), (enemy.y + 78), enemy.spriteWidth, enemy.spriteHeight )){
        if ((player.x + 17.5) < (enemy.x + 2.5) + enemy.spriteWidth &&
            (player.x + 17.5) + player.spriteWidth > (enemy.x + 2.5) &&
            (player.y + 64.5)  < (enemy.y + 78) + enemy.spriteHeight &&
            player.spriteHeight + (player.y + 64.5) > (enemy.y + 78)) {
              player.score -= player.tempScore;
              player.die();
              player.tempScore = 0;
              resetItemCounts();

              if (player.lives == 0){
                changeItemLoc();
              }
        }
      });

      if ((player.x + 17.5) < (keyX + 30) + 43 &&
          (player.x + 17.5) + player.spriteWidth > (keyX + 2.5) &&
          (player.y + 64.5)  < (keyY + 57) + 85 &&
          player.spriteHeight + (player.y + 64.5) > (keyY + 78)) {
            player.key = true;
            if (keyCount == 0){
              player.score += 2;
              player.tempScore += 2;
              keyCount++;
            }

            const keyIcon = document.querySelector('.key-icon');
            keyIcon.classList.add('found');
      }

      if ((player.x + 17.5) < (gemOrangeX  + 3) + 95 &&
          (player.x + 17.5) + player.spriteWidth > (gemOrangeX  + 2.5) &&
          (player.y + 64.5)  < (gemOrangeY + 58) + 104 &&
          player.spriteHeight + (player.y + 64.5) > (gemOrangeY + 78)) {
            player.gemOrange = true;

            if (gemOrangeCount == 0){
              player.score++;
              player.tempScore++;
              gemOrangeCount++;
            }
      }

      if ((player.x + 17.5) < (gemGreenX  + 3) + 95 &&
          (player.x + 17.5) + player.spriteWidth > (gemGreenX  + 2.5) &&
          (player.y + 64.5)  < (gemGreenY + 58) + 104 &&
          player.spriteHeight + (player.y + 64.5) > (gemGreenY + 78)) {
            player.gemGreen = true;

            if (gemGreenCount == 0){
              player.score++;
              player.tempScore++;
              gemGreenCount++;
            }
      }

      if ((player.x + 17.5) < (gemBlueX  + 3) + 95 &&
          (player.x + 17.5) + player.spriteWidth > (gemBlueX  + 2.5) &&
          (player.y + 64.5)  < (gemBlueY + 58) + 104 &&
          player.spriteHeight + (player.y + 64.5) > (gemBlueY + 78)) {
            player.gemBlue = true;

            if (gemBlueCount == 0){
              player.score++;
              player.tempScore++;
              gemBlueCount++;
            }
      }
    }

    //Collision detection function modified from:
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    // function isCollision(aLocX, aLocY, aWidth, aHeight, bLocX, bLocY, bWidth, bHeight ){
    //   if (aLocX < bLocX + bWidth &&
    //       aLocX + aWidth > bLocX &&
    //       aLocY  < bLocY + bHeight &&
    //       aHeight + aLocY > bLocY){
    //     return true;
    //   }else{
    //     return false;
    //   }
    // }

    function resetItemCounts(){
      gemOrangeCount = 0;
      gemGreenCount = 0;
      gemBlueCount = 0;
      keyCount = 0;
    }


    function checkForWin(){
      if (player.x == WIN_PORTAL_X && player.y == WIN_PORTAL_Y && player.key == true){
        setTimeout(function() {
          player.win();
        }, 200);

        hideItems = true;
        changeItemLoc();

        player.tempScore = 0;
        resetItemCounts();

      }else{
        hideItems = false;
      }
    }

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

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */

    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
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

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        ctx.drawImage(Resources.get('images/selector.png'), 202, -41.5);

        if (player.key == false && hideItems == false){
          ctx.drawImage(Resources.get('images/key.png'), keyX, keyY);
        }

        if (player.gemOrange == false && hideItems == false){
          ctx.drawImage(Resources.get('images/gem-orange.png'), gemOrangeX, gemOrangeY);
        }

        if (player.gemGreen == false && hideItems == false){
          ctx.drawImage(Resources.get('images/gem-green.png'), gemGreenX, gemGreenY);
        }

        if (player.gemBlue == false && hideItems == false){
          ctx.drawImage(Resources.get('images/gem-blue.png'), gemBlueX, gemBlueY);
        }

        renderEntities();
    }


    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
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
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
