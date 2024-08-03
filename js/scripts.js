// scripts.js

document.addEventListener("DOMContentLoaded", () => {
    let currentWordList = [];
    let initialTiles = [];
    let currentGameMode = '';
    let originalWord = '';
    let foundWords = new Set();
    let possibleWords = new Set();
    let isTouchDevice = isMobileDevice();

    const gameModes = {
        "two-letter-words": {
            name: "2-Letter Words",
            description: "Given 7 random tiles, find as many 2 letter words as you can!"
        },
        "three-letter-words": {
            name: "3-Letter Words",
            description: "Given 7 random tiles, find as many 3 letter words as you can!"
        },
        "q-without-u-words": {
            name: "Q without U Words",
            description: "Practice words containing Q without a following U."
        },
        "vowel-heavy-words": {
            name: "Vowel Heavy Words",
            description: "Practice words that are heavy on vowels."
        },
        "jqxz-words-4-letter": {
            name: "JQXZ Words (4 letter)",
            description: "Practice four-letter words containing J, Q, X, or Z."
        },
        "jqxz-words-5-letter": {
            name: "JQXZ Words (5 letter)",
            description: "Practice five-letter words containing J, Q, X, or Z."
        },
        "words-without-vowels": {
            name: "Words Without Vowels",
            description: "Practice words that do not contain vowels."
        },
        "500-more-useful-words": {
            name: "500+ More Useful Words",
            description: "Practice 500+ more useful words."
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

        if (e.target.className.includes('cell') && !e.target.hasChildNodes()) {
            const tile = document.querySelector(`.dragging`);
            e.target.appendChild(tile);
        } else if (sourceId === 'board' && e.target.id === 'tiles-container') {
            const tile = document.querySelector(`.dragging`);
            e.target.appendChild(tile);
        }
    }

    function touchStart(e) {
        e.preventDefault();
        const tile = e.target;
        tile.classList.add('dragging');
        const touch = e.touches[0];
        tile.style.left = `${touch.pageX - tile.offsetWidth / 2}px`;
        tile.style.top = `${touch.pageY - tile.offsetHeight / 2}px`;
    }

    function touchMove(e) {
        e.preventDefault();
        const tile = e.target;
        const touch = e.touches[0];
        tile.style.left = `${touch.pageX - tile.offsetWidth / 2}px`;
        tile.style.top = `${touch.pageY - tile.offsetHeight / 2}px`;
    }

    function touchEnd(e) {
        e.preventDefault();
        const tile = e.target;
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
    
        // Reset the board before rendering new tiles
        resetBoard();
        foundWords.clear();
        updateFoundWordsList();
    
        const wordsSection = document.getElementById('words-section');
        const wordsFoundElement = document.getElementById('words-found');
        const possibleWordsElement = document.getElementById('possible-words');
    
        if (game === "two-letter-words" || game === "three-letter-words") {
            const randomTiles = generateRandomTiles();
            renderTiles(randomTiles);
            calculatePossibleWords(randomTiles, game);
            wordsSection.style.display = 'block';
            wordsFoundElement.style.display = 'block';
            possibleWordsElement.style.display = 'block';
        } else {
            // Select a random word and shuffle its letters
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
        if (currentGameMode === "2-Letter Words" || currentGameMode === "3-Letter Words") {
            const remainingWords = Array.from(new Set(possibleWords.filter(word => !foundWords.has(word))));
            resultContainer.innerHTML = `<p>Words you didn't find: ${remainingWords.join(', ')}</p>`;
        } else {
            resultContainer.innerHTML = `<p>The word was: ${originalWord}</p>`;
        }
    }

    createBoard();
    renderTiles([]);

    // Expose renderTiles, submitWord, loadWordList, resetBoard, and giveUp to the global scope
    window.renderTiles = renderTiles;
    window.submitWord = submitWord;
    window.loadWordList = loadWordList;
    window.resetBoard = resetBoard;
    window.giveUp = giveUp;
});
