// scripts.js

/*
THIS FILE IS DEPCRETATED
All logic has been moved into other files. 
    main.js: Initializes the game and exposes functions to the global scope.
    gameLogic.js: Contains the game logic functions like createBoard, renderTiles, etc.
    tiles.js: Handles tile creation and drag-and-drop functionality.
    utils.js: Contains utility functions like isMobileDevice.
    config.js: Holds game configuration data like gameModes.
Do not use this file. It can be deleted at any time.
*/

document.addEventListener("DOMContentLoaded", () => {
    let currentWordList = [];
    let initialTiles = [];
    let currentGameMode = '';
    let isListGame = false;
    let originalWord = '';
    let foundWords = new Set();
    let possibleWords = new Set();
    let isTouchDevice = isMobileDevice();

    const gameModes = {
        "two-letter-words": {
            name: "2-Letter Words",
            description: "Given 7 random tiles, find as many 2 letter words as you can!",
            isListGame: true,
            requiresWordLookup: false,
        },
        "three-letter-words": {
            name: "3-Letter Words",
            description: "Given 7 random tiles, find as many 3 letter words as you can!",
            isListGame: true,
            requiresWordLookup: false,
        },
        "top-5000-7-letter-words": {
            name: "Top 5000 7-Letter Words",
            description: "Given 7 common tiles, find as many 7 letter bingos as you can!",
            isListGame: true,
            requiresWordLookup: true,
        },
        "top-5000-8-letter-words": {
            name: "Top 5000 8-Letter Words",
            description: "Given 8 common tiles, find as many 8 letter bingos as you can!",
            isListGame: true,
            requiresWordLookup: true,
        },
        "q-without-u-words": {
            name: "Q without U Words",
            description: "Practice words containing Q without a following U.",
            isListGame: false,
            requiresWordLookup: true,
        },
        "vowel-heavy-words": {
            name: "Vowel Heavy Words",
            description: "Practice words that are heavy on vowels.",
            isListGame: false,
            requiresWordLookup: true,
        },
        "jqxz-words-4-letter": {
            name: "JQXZ Words (4 letter)",
            description: "Practice four-letter words containing J, Q, X, or Z.",
            isListGame: false,
            requiresWordLookup: true,
        },
        "jqxz-words-5-letter": {
            name: "JQXZ Words (5 letter)",
            description: "Practice five-letter words containing J, Q, X, or Z.",
            isListGame: false,
            requiresWordLookup: true,
        },
        "words-without-vowels": {
            name: "Words Without Vowels",
            description: "Practice words that do not contain vowels.",
            isListGame: false,
            requiresWordLookup: true,
        },
        "500-more-useful-words": {
            name: "500+ More Useful Words",
            description: "Practice 500+ more useful words.",
            isListGame: false,
            requiresWordLookup: true,
        }
    };

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    function createTile(letter) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = letter;
        tile.draggable = true;
        tile.addEventListener('dragstart', dragStart);
        tile.addEventListener('dragend', dragEnd);
        tile.addEventListener('dblclick', returnToRack);

        if (isTouchDevice) {
            tile.addEventListener('touchstart', touchStart);
            tile.addEventListener('touchmove', touchMove);
            tile.addEventListener('touchend', touchEnd);
        }

        return tile;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderTiles(letters) {
        const tilesContainer = document.getElementById('tiles-container');
        tilesContainer.innerHTML = ''; // Clear existing tiles
        initialTiles = []; // Clear initial tiles array

        letters.forEach(letter => {
            const tile = createTile(letter);
            tilesContainer.appendChild(tile);
            initialTiles.push(tile);
        });

        if (letters.length === 0) {
            tilesContainer.classList.add('empty');
        } else {
            tilesContainer.classList.remove('empty');
        }
    }

    function createBoard() {
        const board = document.getElementById('board');
        board.innerHTML = ''; // Clear existing board

        const rows = 3; // Number of rows
        const cols = 10; // Number of columns

        for (let i = 0; i < rows * cols; i++) { // Create cells
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('drop', drop);

            if (isTouchDevice) {
                cell.addEventListener('touchstart', touchStart);
                cell.addEventListener('touchmove', touchMove);
                cell.addEventListener('touchend', touchEnd);
            }

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

        const draggingTile = document.querySelector('.dragging');
        const targetTile = e.target;

        if (targetTile.className.includes('tile')) {
            swapTiles(draggingTile, targetTile);
        } else if (e.target.className.includes('cell') && !e.target.hasChildNodes()) {
            e.target.appendChild(draggingTile);
        } else if (sourceId === 'board' && e.target.id === 'tiles-container') {
            e.target.appendChild(draggingTile);
        }
    }

    function swapTiles(tile1, tile2) {
        const parent1 = tile1.parentNode;
        const sibling1 = tile1.nextSibling === tile2 ? tile1 : tile1.nextSibling;
        tile2.parentNode.insertBefore(tile1, tile2);
        parent1.insertBefore(tile2, sibling1);
    }

    function touchStart(e) {
        e.preventDefault();
        const tile = e.target;
        if (!tile.classList.contains('tile')) return;
        tile.classList.add('dragging');
        const touch = e.touches[0];
        tile.style.left = `${touch.pageX - tile.offsetWidth / 2}px`;
        tile.style.top = `${touch.pageY - tile.offsetHeight / 2}px`;
    }

    function touchMove(e) {
        e.preventDefault();
        const tile = e.target;
        if (!tile.classList.contains('tile')) return;
        const touch = e.touches[0];
        tile.style.left = `${touch.pageX - tile.offsetWidth / 2}px`;
        tile.style.top = `${touch.pageY - tile.offsetHeight / 2}px`;
    }

    function touchEnd(e) {
        e.preventDefault();
        const tile = e.target;
        if (!tile.classList.contains('tile')) return;
        tile.classList.remove('dragging');
        const touch = e.changedTouches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

        if (targetElement && targetElement.className.includes('cell') && !targetElement.hasChildNodes()) {
            targetElement.appendChild(tile);
        } else {
            const tilesContainer = document.getElementById('tiles-container');
            tilesContainer.appendChild(tile);
            tile.style.left = '';
            tile.style.top = '';
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
        // Clear the result container
        const resultContainer = document.getElementById('result-container');
        resultContainer.innerHTML = '';
    
        const wordListUrl = `assets/${game}.json`; // URL to the word list JSON file
        const response = await fetch(wordListUrl);
        const data = await response.json();
        currentWordList = data.words;
    
        // Update the game mode text and description
        const gameModeElement = document.getElementById('game-mode');
        const gameModeDescriptionElement = document.getElementById('game-mode-description');
        gameModeElement.textContent = gameModes[game].name;
        gameModeDescriptionElement.textContent = gameModes[game].description;
        currentGameMode = gameModes[game].name;
        isListGame = gameModes[game].isListGame;
        let requiresWordLookup = gameModes[game].requiresWordLookup;
    
        // Reset the board before rendering new tiles
        resetBoard();
        foundWords.clear();
        updateFoundWordsList();
    
        const wordsSection = document.getElementById('words-section');
        const wordsFoundElement = document.getElementById('words-found');
        const possibleWordsElement = document.getElementById('possible-words');
    
        if (isListGame && !requiresWordLookup) {
            // Games where you guess multiple words, but the starting letters are generated randomly
            let randomTiles = generateRandomTiles();
            // Prevent games with 0 possible words
            let numPossibleWords = calculatePossibleWords(randomTiles, game);
            while (numPossibleWords === 0) {
                randomTiles = generateRandomTiles();
                numPossibleWords = calculatePossibleWords(randomTiles, game);
            }
            renderTiles(randomTiles);
            wordsSection.style.display = 'block';
            wordsFoundElement.style.display = 'block';
            possibleWordsElement.style.display = 'block';
        } else if (isListGame && requiresWordLookup) {
            // Games where you guess multiple words, but a source word list is used to get the starting letters
            originalWord = currentWordList[Math.floor(Math.random() * currentWordList.length)].toUpperCase(); // Store the original word
            const shuffledLetters = shuffleArray(originalWord.split(''));
            renderTiles(shuffledLetters);
            calculatePossibleWords(shuffledLetters, game);
            wordsSection.style.display = 'block';
            wordsFoundElement.style.display = 'block';
            possibleWordsElement.style.display = 'block';
        } else {
            // Games you guess a single word, sourced from a master list
            originalWord = currentWordList[Math.floor(Math.random() * currentWordList.length)].toUpperCase(); // Store the original word
            const shuffledLetters = shuffleArray(originalWord.split(''));
            renderTiles(shuffledLetters);
            wordsSection.style.display = 'none';
            wordsFoundElement.style.display = 'none';
            possibleWordsElement.style.display = 'none';
        }
    }

    function generateRandomTiles() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomTiles = [];
        for (let i = 0; i < 7; i++) {
            randomTiles.push(letters[Math.floor(Math.random() * letters.length)]);
        }
        return randomTiles;
    }

    function calculatePossibleWords(tiles, game) {
        possibleWords = [];
        const tileCount = tiles.reduce((acc, tile) => {
            acc[tile] = (acc[tile] || 0) + 1;
            return acc;
        }, {});
    
        currentWordList.forEach(word => {
            const wordCount = {};
            for (const letter of word) {
                wordCount[letter] = (wordCount[letter] || 0) + 1;
            }
    
            if (Object.keys(wordCount).every(letter => wordCount[letter] <= (tileCount[letter] || 0))) {
                possibleWords.push(word);
            }
        });
    
        document.getElementById('possible-words-count').textContent = possibleWords.length;
        return possibleWords.length;
    }

    function updatePossibleWordsCount() {
        const possibleWordsCountElement = document.getElementById('possible-words-count');
        possibleWordsCountElement.textContent = possibleWords.size;
    }

    function updateFoundWordsList() {
        const foundWordsListElement = document.getElementById('words-found-list');
        const wordsArray = Array.from(foundWords);
        if (wordsArray.length === 0) {
            foundWordsListElement.textContent = `${wordsArray.length}`;
        } else {
            foundWordsListElement.textContent = `${wordsArray.length} [${wordsArray.join(', ')}]`;
        }
    }

    function collectWordFromBoard() {
        const cells = document.querySelectorAll('.board .cell');
        let collectedWord = '';
        let prevIndex = null;

        cells.forEach((cell, index) => {
            if (cell.textContent.trim() !== '') {
                if (prevIndex !== null && index !== prevIndex + 1) {
                    // If there's a gap in the word, set collectedWord to 'invalid'
                    collectedWord = '-1';
                    return;
                }

                collectedWord += cell.textContent.trim();
                prevIndex = index;
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
        if (word === '-1') {
            displayResult("Letters must be touching and on the same row.", false);
        } else if (word.length === 0) {
            displayResult("Please form a word on the board.", false);
        } else if (currentWordList.includes(word) && !foundWords.has(word)) {
            foundWords.add(word);
            updateFoundWordsList();
            displayResult(`Correct! ${word} is a valid word.`, true);
        } else if (foundWords.has(word)) {
            displayResult(`You already found the word ${word}.`, false);
        } else {
            displayResult(`Incorrect! ${word} is not in the ${currentGameMode} list.`, false);
        }
    }

    function resetBoard() {
        const tilesContainer = document.getElementById('tiles-container');
        const board = document.getElementById('board');

        // Clear the board
        const cells = board.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (cell.hasChildNodes()) {
                tilesContainer.appendChild(cell.firstChild);
            }
        });
    }

    function giveUp() {
        const resultContainer = document.getElementById('result-container');
        resultContainer.style.color = 'lime'
        if (isListGame) {
            const remainingWords = Array.from(new Set(possibleWords.filter(word => !foundWords.has(word))));
            resultContainer.innerHTML = `<p>Words you didn't find: ${remainingWords.join(', ')}</p>`;
        } else {
            resultContainer.innerHTML = `<p>The word was: ${originalWord}</p>`;
        }
    }

    createBoard();
    renderTiles([]);
    const removeTileText = document.getElementById('remove-tile-text');
    if (isTouchDevice) {
        removeTileText.innerHTML = '<p>To remove a tile from the board, drag it off the game grid.</p>'
    } else {
        removeTileText.innerHTML = '<p>To remove a tile from the board, double click it.</p>'
    }

    // Expose renderTiles, submitWord, loadWordList, resetBoard, and giveUp to the global scope
    window.renderTiles = renderTiles;
    window.submitWord = submitWord;
    window.loadWordList = loadWordList;
    window.resetBoard = resetBoard;
    window.giveUp = giveUp;
});
