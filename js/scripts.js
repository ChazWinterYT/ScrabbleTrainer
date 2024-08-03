// scripts.js

document.addEventListener("DOMContentLoaded", () => {
    let currentWordList = [];

    function createTile(letter) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = letter;
        tile.draggable = true;
        tile.addEventListener('dragstart', dragStart);
        tile.addEventListener('dragend', dragEnd);
        return tile;
    }

    function renderTiles() {
        const tilesContainer = document.getElementById('tiles-container');
        const letters = 'EXAMPLE'.split('');
        
        tilesContainer.innerHTML = ''; // Clear existing tiles

        letters.forEach(letter => {
            const tile = createTile(letter);
            tilesContainer.appendChild(tile);
        });
    }

    function createBoard() {
        const board = document.getElementById('board');
        board.innerHTML = ''; // Clear existing board

        const rows = 5; // Number of rows
        const cols = 15; // Number of columns

        for (let i = 0; i < rows * cols; i++) { // Create cells
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('drop', drop);
            board.appendChild(cell);
        }

        board.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
        board.style.gridTemplateRows = `repeat(${rows}, 50px)`;
    }

    function dragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.textContent);
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const letter = e.dataTransfer.getData('text/plain');
        const tile = createTile(letter); // Clone the tile
        e.target.innerHTML = ''; // Clear the cell
        e.target.appendChild(tile); // Append the cloned tile to the cell
    }

    async function loadWordList(game) {
        const wordListUrl = `assets/${game}.json`; // URL to the word list JSON file
        const response = await fetch(wordListUrl);
        const data = await response.json();
        currentWordList = data.words;
    }

    function collectWordFromBoard() {
        const cells = document.querySelectorAll('.board .cell');
        let collectedWord = '';

        cells.forEach(cell => {
            if (cell.textContent.trim() !== '') {
                collectedWord += cell.textContent.trim();
            }
        });

        return collectedWord;
    }

    function displayResult(message, isSuccess) {
        const resultContainer = document.getElementById('result-container');
        resultContainer.textContent = message;
        resultContainer.style.color = isSuccess ? 'lime' : 'yellow';
    }

    function submitWord() {
        const word = collectWordFromBoard().toUpperCase();
        if (currentWordList.includes(word)) {
            displayResult(`Correct! ${word} is a valid word.`, true);
        } else {
            displayResult(`Incorrect! ${word} is not in the word list.`, false);
        }
    }

    createBoard();
    renderTiles();

    // Expose renderTiles and submitWord to the global scope
    window.renderTiles = renderTiles;
    window.submitWord = submitWord;
    window.loadWordList = loadWordList;
});
