import { shuffleArray } from './utils.js';
import { gameModes } from './config.js';
import { createTile, dragOver, drop } from './tiles.js';

let currentWordList = [];
let initialTiles = [];
let currentGameMode = '';
let isListGame = false;
let originalWord = '';
let foundWords = new Set();
let possibleWords = new Set();

export function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Clear existing board

    const rows = 3; // Number of rows
    const cols = 10; // Number of columns

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

export function renderTiles(letters) {
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

export async function loadWordList(game) {
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    const wordListUrl = `assets/${game}.json`;
    const response = await fetch(wordListUrl);
    const data = await response.json();
    currentWordList = data.words;

    const gameModeElement = document.getElementById('game-mode');
    const gameModeDescriptionElement = document.getElementById('game-mode-description');
    gameModeElement.textContent = gameModes[game].name;
    gameModeDescriptionElement.textContent = gameModes[game].description;
    currentGameMode = gameModes[game].name;
    isListGame = gameModes[game].isListGame;
    let requiresWordLookup = gameModes[game].requiresWordLookup;

    resetBoard();
    foundWords.clear();
    updateFoundWordsList();

    const wordsSection = document.getElementById('words-section');
    const wordsFoundElement = document.getElementById('words-found');
    const possibleWordsElement = document.getElementById('possible-words');

    if (isListGame && !requiresWordLookup) {
        let randomTiles = generateRandomTiles();
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
        originalWord = currentWordList[Math.floor(Math.random() * currentWordList.length)].toUpperCase();
        const shuffledLetters = shuffleArray(originalWord.split(''));
        renderTiles(shuffledLetters);
        calculatePossibleWords(shuffledLetters, game);
        wordsSection.style.display = 'block';
        wordsFoundElement.style.display = 'block';
        possibleWordsElement.style.display = 'block';
    } else {
        originalWord = currentWordList[Math.floor(Math.random() * currentWordList.length)].toUpperCase();
        const shuffledLetters = shuffleArray(originalWord.split(''));
        renderTiles(shuffledLetters);
        wordsSection.style.display = 'none';
        wordsFoundElement.style.display = 'none';
        possibleWordsElement.style.display = 'none';
    }
}

export function submitWord() {
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

export function generateRandomTiles() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomTiles = [];
    for (let i = 0; i < 7; i++) {
        randomTiles.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    return randomTiles;
}

export function calculatePossibleWords(tiles, game) {
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

function collectWordFromBoard() {
    const cells = document.querySelectorAll('.board .cell');
    let collectedWord = '';
    let prevIndex = null;

    cells.forEach((cell, index) => {
        if (cell.textContent.trim() !== '') {
            if (prevIndex !== null && index !== prevIndex + 1) {
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

function updateFoundWordsList() {
    const foundWordsListElement = document.getElementById('words-found-list');
    const wordsArray = Array.from(foundWords);
    if (wordsArray.length === 0) {
        foundWordsListElement.textContent = `${wordsArray.length}`;
    } else {
        foundWordsListElement.textContent = `${wordsArray.length} [${wordsArray.join(', ')}]`;
    }
}

function updatePossibleWordsCount() {
    const possibleWordsCountElement = document.getElementById('possible-words-count');
    possibleWordsCountElement.textContent = possibleWords.size;
}

export function resetBoard() {
    const tilesContainer = document.getElementById('tiles-container');
    const board = document.getElementById('board');

    const cells = board.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (cell.hasChildNodes()) {
            tilesContainer.appendChild(cell.firstChild);
        }
    });
}

export function giveUp() {
    const resultContainer = document.getElementById('result-container');
    resultContainer.style.color = 'lime'
    if (isListGame) {
        const remainingWords = Array.from(new Set(possibleWords.filter(word => !foundWords.has(word))));
        resultContainer.innerHTML = `<p>Words you didn't find: ${remainingWords.join(', ')}</p>`;
    } else {
        resultContainer.innerHTML = `<p>The word was: ${originalWord}</p>`;
    }
}
