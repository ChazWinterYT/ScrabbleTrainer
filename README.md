# ScrabbleTrainer
Interactive training app for improving Scrabble skills and vocabulary

## Files
  /js
    main.js: Initializes the game and exposes functions to the global scope.
    gameLogic.js: Contains the game logic functions like createBoard, renderTiles, etc.
    tiles.js: Handles tile creation and drag-and-drop functionality.
    utils.js: Contains utility functions like isMobileDevice.
    config.js: Holds game configuration data like gameModes.

  /css
    styles.css: Main style sheet for the ScrabbleTrainer app.

  /assets
    JSON files to store the word lists for each game type. One list per game type, per JSON file.

  /fonts
    font files used to render tiles to the page with the need for images. Results in faster loading than using images.

  /.github/workflows
    deploy.yml: Deployment script that runs automatically when files are pushed. Responsible for running the build.js script and for sending changed files to AWS S3 for use on the website.
  
  build.js: Node script for inserting the version number at the bottom of the page before deploying to AWS S3.

  index.html: The main landing page fo the app.

  LICENSE: Just a license telling you what you can do with my code.

  README.md: The file you're reading right now.
