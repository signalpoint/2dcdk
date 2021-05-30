<!doctype html>
<?php

  $games = [
    'ColorArcher',
    'MatchAttack',
    'SunkenStash',
  ];

  $game = isset($_GET['game']) ? $_GET['game'] : NULL;

?>
<html lang="en">
  <head>

    <title><?php print $game ? $game : 'Malt Labs'; ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- BOOTSTRAP-->
    <link href="vendor/twbs/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">

    <?php if ($game) { ?>

    <!-- sdk -->
    <script type="text/javascript" src="js/classes/game.js"></script>
    <script type="text/javascript" src="js/classes/entity.js"></script>
    <script type="text/javascript" src="js/classes/atmosphere.js"></script>
    <script type="text/javascript" src="js/classes/terrain.js"></script>
    <script type="text/javascript" src="js/classes/sprite.js"></script>
    <script type="text/javascript" src="js/classes/player.js"></script>
    <script type="text/javascript" src="js/classes/enemy.js"></script>
    <script type="text/javascript" src="js/classes/item.js"></script>

    <!-- game -->
    <script type="text/javascript" src="games/<?php print $game; ?>.js"></script>

    <?php } ?>

  </head>

  <body <?php if ($game) { ?>onload="<?php print $game; ?>()"<?php } ?>>
    <!--<button onmousedown="accelerate(-0.2)" onmouseup="accelerate(0.05)">ACCELERATE!</button>-->

    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="/">Malt Labs</a>
    </header>

    <div class="container-fluid">

      <div class="row">

        <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
              <?php foreach ($games as $_game) { ?>
              <li class="nav-item">
                <a class="nav-link <?php if ($game && $game == $_game) { print 'active'; } ?>" href="/?game=<?php print $_game; ?>">
                  <?php print $_game; ?>
                </a>
              </li>
              <?php } ?>
            </ul>
          </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">

          <!-- Game Canvas Container -->
          <?php

            if ($game) {
              ?><div id="<?php print $game; ?>"></div><?php
            }

          ?>

        </main>

      </div><!-- row -->

    </div><!-- container-fluid -->

  </body>

</html>
