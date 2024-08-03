// scripts.js

async function fetchWordList(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.words;
}

function createTile(letter) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = letter;
    tile.draggable = true;
    tile.addEventListener('dragstart', dragStart);
    tile.addEventListener('dragend', dragEnd);
    return tile;
}

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Clear existing board

    for (let i = 0; i < 225; i++) { // 15x15 board
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', drop);
        board.appendChild(cell);
    }
}

async function loadGame(game) {
    const playArea = document.getElementById('play-area');
    playArea.innerHTML = `<p>Loading ${game}...</p>`;

    const tilesContainer = document.getElementById('tiles-container');
    tilesContainer.innerHTML = ''; // Clear existing tiles

    const wordListUrl = `assets/${game}.json`; // URL to the word list JSON file
    const wordList = await fetchWordList(wordListUrl);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Example letters
    for (const letter of letters) {
        const tile = createTile(letter);
        tilesContainer.appendChild(tile);
    }

    createBoard();

    playArea.innerHTML = `
        <h2>${game}</h2>
        <p>This will be the ${game} training game.</p>
        ${game === 'two-letter-words' ? '<p>This game will be played differently from the others.</p>' : ''}
        <p class="small-text">The loading times are fake, btw.</p>
    `;
    playArea.appendChild(tilesContainer);
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
    e.target.textContent = letter;
}
