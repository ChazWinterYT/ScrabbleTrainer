// scripts.js
function loadGame(game) {
    const playArea = document.getElementById('play-area');
    playArea.innerHTML = `<p>Loading ${game}...</p>`;
    
    setTimeout(() => {
        playArea.innerHTML = `
            <h2>${game}</h2>
            <p>This will be the ${game} training game.</p>
            <p class="small-text">(The loading times are fake, btw.)</p>
        `;
    }, 500); // Simulating a load delay
}
