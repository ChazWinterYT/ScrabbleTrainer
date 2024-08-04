import { createBoard, renderTiles, loadWordList, submitWord, resetBoard, giveUp, playAgain } from './gameLogic.js';
import { isMobileDevice } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    renderTiles([]);

    const removeTileText = document.getElementById('remove-tile-text');
    if (isMobileDevice()) {
        removeTileText.innerHTML = '<p>To remove a tile from the board, drag it off the game grid.</p>'
    } else {
        removeTileText.innerHTML = '<p>To remove a tile from the board, double click it.</p>'
    }

    // Expose functions to the global scope
    window.renderTiles = renderTiles;
    window.submitWord = submitWord;
    window.loadWordList = loadWordList;
    window.resetBoard = resetBoard;
    window.giveUp = giveUp;
    window.playAgain = playAgain;
});
