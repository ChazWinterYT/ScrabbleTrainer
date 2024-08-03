// scripts.js
function loadGame(game) {
    const playArea = document.getElementById('play-area');
    playArea.innerHTML = `<p>Loading ${game}...</p>`;
    
    // Common content for all games
    const commonContent = `
        <h2>${game}</h2>
        <p>This will be the ${game} training game.</p>
    `;

    // Special message for two-letter-words game
    const specialMessage = game === 'two-letter-words' ? '<p><i>This game will be played differently from the others.</i></p>' : '';

    // Small text message
    const smallTextMessage = '<p class="small-text">The loading times are fake, btw.</p>';

    // Combine all parts and update the play area
    setTimeout(() => {
        playArea.innerHTML = commonContent + specialMessage + smallTextMessage;
    }, 500); // Simulating a load delay
}
