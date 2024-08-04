export function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function swapTiles(tile1, tile2) {
    const parent1 = tile1.parentNode;
    const sibling1 = tile1.nextSibling === tile2 ? tile1 : tile1.nextSibling;
    tile2.parentNode.insertBefore(tile1, tile2);
    parent1.insertBefore(tile2, sibling1);
}
