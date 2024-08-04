import { swapTiles, isMobileDevice } from './utils.js';

export function createTile(letter) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = letter;
    tile.draggable = true;
    tile.addEventListener('dragstart', dragStart);
    tile.addEventListener('dragend', dragEnd);
    tile.addEventListener('dblclick', returnToRack);

    if (isMobileDevice()) {
        tile.addEventListener('touchstart', touchStart);
        tile.addEventListener('touchmove', touchMove);
        tile.addEventListener('touchend', touchEnd);
    }

    return tile;
}

export function dragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.dataTransfer.setData('source', e.target.parentElement.id);
}

export function dragEnd(e) {
    e.target.classList.remove('dragging');
}

export function dragOver(e) {
    e.preventDefault();
}

export function drop(e) {
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

export function returnToRack(e) {
    const tile = e.target;
    const tilesContainer = document.getElementById('tiles-container');
    if (tile.parentElement.className.includes('cell')) {
        tilesContainer.appendChild(tile);
    }
}

export function touchStart(e) {
    e.preventDefault();
    const tile = e.target;
    if (!tile.classList.contains('tile')) return;
    tile.classList.add('dragging');
    const touch = e.touches[0];
    tile.style.left = `${touch.pageX - tile.offsetWidth / 2}px`;
    tile.style.top = `${touch.pageY - tile.offsetHeight / 2}px`;
}

export function touchMove(e) {
    e.preventDefault();
    const tile = e.target;
    if (!tile.classList.contains('tile')) return;
    const touch = e.touches[0];
    tile.style.left = `${touch.pageX - tile.offsetWidth / 2}px`;
    tile.style.top = `${touch.pageY - tile.offsetHeight / 2}px`;
}

export function touchEnd(e) {
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
