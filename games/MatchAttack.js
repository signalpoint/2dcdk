var gameSetup = {

  id: 'MatchAttack',

  numberOfPlayers: 1,
  totalPairs: 5,
  itemsPerPair: 2,
  playerHasChosen: false,
  playerHasMatch: false,
  pairsFound: 0,
  squareSize: 30,

  // HANDLERS

  brain: function() {

    // TODO stop the game if we're waiting for input? we don't want the
    // game to run forever if the user is idle!
    game.stop();

  },

  // MOUSE CONTROLS

  // WARNING: getting rid of these seems to cause the Numbers to lose
  // their click listeners!

//        mousemove: null,
  mousedown: function(event) {
//          console.log('mousedown', this.getMousePosition(event));
  },
  mouseup: function(event) {
//          console.log('mouseup:', this.getMousePosition(event));
  }

};

// Game Loader
function MatchAttack() {

  // SKY
  sky = new Atmosphere({
    width: 640,
    height: 400,
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(0,0,200,0.2)";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  });
  game.add(sky);

  // GROUND
  ground = new Terrain({
    width: 640,
    height: 80,
    y: sky.height,
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(0,300,0,0.2)";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  });
  game.add(ground);

  // PLAYERS
  for (var i = 0; i < game.numberOfPlayers; i++) {
    game.add(new Player({
      x: (ground.width / game.numberOfPlayers) * i,
      y: ground.y,
      width: 100,
      height: 50,
      name: 'Player' + i,
      matches: [],
      score: 0,
      draw: function() {
        var ctx = game.context;

        // Name.
        var label = this.name;

        // Score.
        if (this.score) { label += ' (+' + this.score + ')'; }

        ctx.fillStyle = this.isCurrentPlayer() ? "rgba(500,0,250,1)" : "rgba(0,0,0,1)";
        ctx.font = "20px Arial";
        ctx.fillText(label, this.x, this.y + this.height, this.width);
      }
    }));
  }
  game.setPlayer(game.getPlayers()[0]);

  // NUMBERS
  // Generate the numbers that will be matched, one of each.
  // Then Now generate a pair (of 2 or more) for each number.
  var numbers = [];
  while (numbers.length != game.totalPairs) {
    var number = Math.floor(Math.random() * game.canvas.height);
    if (!numbers.includes(number)) {
      numbers.push(number);
    } 
  }
  numbers.forEach((number) => {
    for (var i = 0; i < game.itemsPerPair; i++) {

      var item = new Item({

        width: game.squareSize,
        height: game.squareSize,
        fillStyle: "rgba(0,0,0,1)",

        facedown: 1,
        number: number,
        claimed: false,

        draw: function() {

          // If the number has been claimed via a match, don't show it.
          if (this.claimed) { return; }

          // The number hasn't yet been claimed...

          var ctx = game.context;

          ctx.fillStyle = this.fillStyle;

          if (this.facedown) {
            ctx.fillRect(this.x,this.y,this.width,this.height);
          }
          else {
            ctx.font = "32px Arial";
            ctx.fillText(this.number, this.x, this.y + this.height, this.width);
          }

        },
        mousedown: function(event) {

          // They've clicked on an item...

          var facedown = this.facedown;
          console.log(facedown);

          var player = game.getPlayer();
          var playerItems = player.getItems();

          // If they've already chosen everything...
          if (game.playerHasChosen) {

            // We only care about clicks on face up items.
            if (this.facedown) { console.log('that is not face up!'); return; }

//                  console.log('You have already selected the max: ' + game.itemsPerPair);

//                  console.log('match?', game.playerHasMatch);

            // If the player has a match...
            if (game.playerHasMatch) {

              // They are claiming their item...

              this.claimed = true;

              player.matches.push(this);

              player.removeItem(this);

              // If the player doesn't have any more items...
              if (!playerItems.length) {

                // They've just scored and can go again.
                player.score++;
                game.playerHasChosen = false;

                game.pairsFound++;

                // Is the game over?
                if (game.pairsFound == game.totalPairs) {
                  setTimeout(function() { alert('Finished!'); });
                  game.stop();
                }

              }

            }
            else {

              // The player doesn't have a match...

              // They are flipping the item facedown...

              this.facedown = true;

              player.removeItem(this);

              // If the player doesn't have any more items, switch to the
              // next player.
              if (!playerItems.length) {
                game.setPlayer(game.getNextPlayer());
                game.playerHasChosen = false;
              }

            }

          }
          else {

            // They haven't yet chosen everything...

            // If it's face up, don't do anything.
            if (!this.facedown) { return; }

            // Flip it!
            this.facedown = !this.facedown;

            // Now face up...
            if (!this.facedown) {

              // They just flipped it face up...

              // Add the item to the player.
              player.addItem(this);
//                  this.fillStyle = "rgba(0,0,0,1)";

              // If they just picked all the items they can for this turn...
              if (playerItems.length == game.itemsPerPair) {

                game.playerHasChosen = true;

//                      console.log('You have just selected the max: ' + game.itemsPerPair);

                // Do all the items match?
                var matchingItems = true;
                var numberToMatch = playerItems[0].number;
                for (var i = 1; i < playerItems.length; i++) {
                  if (playerItems[i].number != numberToMatch) {
                    matchingItems = false;
                    break;
                  }
                }

                game.playerHasMatch = matchingItems;

                if (matchingItems) {

                  // The items match...

                  // TODO Update the UX to show the match!

                }
                else {

                  // The items don't match...

                  // TODO Update the UX to show the mis-match!

                }

              }
              else {

                // They can still pick up more item(s)...

                game.playerHasChosen = false;

              }

            }
            else {

              // Now face down... (shouldn't happen)

            }

          }

          game.update();

        }
      });

      // Find an open spot for the item.
      var openSpot = game.findAnOpenSpot(item);
      item.x = openSpot.x;
      item.y = openSpot.y;

      // Add the item to the game.
      game.add(item);

    }

  });

  game.start();

}

var game = new Game(gameSetup);
