// scripts.js

document.addEventListener("DOMContentLoaded", () => {
    let currentWordList = [];
    let initialTiles = [];

    function createTile(letter) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = letter;
        tile.draggable = true;
        tile.addEventListener('dragstart', dragStart);
        tile.addEventListener('dragend', dragEnd);
        tile.addEventListener('dblclick', returnToRack);
        return tile;
    }

    function renderTiles() {
        const tilesContainer = document.getElementById('tiles-container');
        const letters = 'EXAMPLE'.split('');
        
        tilesContainer.innerHTML = ''; // Clear existing tiles
        initialTiles = []; // Clear initial tiles array

        letters.forEach(letter => {
            const tile = createTile(letter);
            tilesContainer.appendChild(tile);
            initialTiles.push(tile);
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
        e.dataTransfer.setData('source', e.target.parentElement.id);
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
        const sourceId = e.dataTransfer.getData('source');

        if (e.target.className.includes('cell') && !e.target.hasChildNodes()) {
            const tile = document.querySelector(`.dragging`);
            e.target.appendChild(tile);
        } else if (sourceId === 'board' && e.target.id === 'tiles-container') {
            const tile = document.querySelector(`.dragging`);
            e.target.appendChild(tile);
        }
    }

    function returnToRack(e) {
        const tile = e.target;
        const tilesContainer = document.getElementById('tiles-container');
        if (tile.parentElement.className.includes('cell')) {
            tilesContainer.appendChild(tile);
        }
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
        resultContainer.style.color = isSuccess ? 'green' : 'red';
    }

    function submitWord() {
        const word = collectWordFromBoard().toUpperCase();
        if (currentWordList.includes(word)) {
            displayResult(`Correct! ${word} is a valid word.`, true);
        } else {
            displayResult(`Incorrect! ${word} is not in the word list.`, false);
        }
    }

    function resetBoard() {
        const tilesContainer = document.getElementById('tiles-container');
        const board = document.getElementById('board');
        tilesContainer.innerHTML = ''; // Clear existing tiles in the rack

        // Return all tiles to the initial container
        initialTiles.forEach(tile => {
            tilesContainer.appendChild(tile);
        });

        // Clear the board
        const cells = board.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.innerHTML = '';
        });
    }

    createBoard();
    renderTiles();

    // Expose renderTiles, submitWord, loadWordList, and resetBoard to the global scope
    window.renderTiles = renderTiles;
    window.submitWord = submitWord;
    window.loadWordList = loadWordList;
    window.resetBoard = resetBoard;
});
