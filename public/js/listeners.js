/*
main.js
-------
Handles the main game interactions and Firebase event listeners for the game.

Responsibilities:
    - Manage join screen and player logs
    - Show/hide popup
    - Start new rounds and reset timers
    - Listen for player moves and update statuse4s in real-time
    - Maintain player positions and scores in the UI
    - Display waiting messages when the game isn't full.

Notes:
    - Relies heavily on Firebase real-time database for game state synchronization.
    - Updates DOM elements dynamically based on state.
    - Could possibly work on cutting down redundancies in the future like the player listener.
*/
import { db, joinBtn, chooseNumberBtn, popup, closeBtn, startRoundBtn, joinScreen, gameScreen } from './firebase.js';
import { state } from './state.js';
import { startNewRound } from './ui.js';

chooseNumberBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
});

joinBtn.addEventListener('click', () => {
    state.myName = document.getElementById("playerNameInput").value.trim();
    if (!state.myName) {
        alert("Please enter your name");
        return;
    }
    db.ref("players").once("value").then(snapshot => {
        let players = snapshot.val() || {};
        let playerCount = Object.keys(players).length;
        if (playerCount >= 4) {
            alert("Game full (four players maximum)");
            return;
        }

        for (let i = 1; i <= 4; i++) {
            if (!players[`p${i}`]) {
                state.myPlayerID = `p${i}`;
                state.playerTags[state.myPlayerID] = state.myName;
                db.ref("players/" + state.myPlayerID).set({ name: state.myName, joined: true});
                db.ref("players/" + state.myPlayerID).onDisconnect().remove();
                db.ref("moves/" + state.myPlayerID).set({name: state.myName, move: -1});
                db.ref("moves/" + state.myPlayerID).onDisconnect().remove();
                db.ref("scores/" + state.myName).onDisconnect().remove();
                break;
            }
        }
        joinScreen.style.display = "none";
        gameScreen.style.display = "block";
    })
})

startRoundBtn.addEventListener('click', () => {
    if (state.myPlayerID) {
        startNewRound();
    }
}); 

// Listen for changes in Firebase moves
db.ref("moves").on("value", snapshot => {
    const movesData = snapshot.val() || {};
    state.moves = {}; // reset local moves
    // Build moves object: playerID -> number
    Object.keys(movesData).forEach(playerID => {
        state.moves[playerID] = movesData[playerID].move;
    });
    state.currMoves = state.moves;
    // Update player statuses
    Object.keys(state.playerTags).forEach(playerID => {
        const playerDiv = document.getElementById(playerID);
        if (!playerDiv) return;
        const statusDiv = playerDiv.querySelector(".status");
        if (!statusDiv) return;
        if (state.moves[playerID] !== -1) {
            statusDiv.textContent = "Has chosen!";
        } else {
            statusDiv.textContent = "Choosing...";
        }
    });
});

closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});


// Listen for eliminations
db.ref("eliminated").on("value", snapshot => {
    let elimVal = snapshot.val();
    if (Array.isArray(elimVal)) {
        state.eliminated = elimVal;
    } else if (elimVal && typeof elimVal === "object") {
        state.eliminated = Object.keys(elimVal); // fallback if object
    } else {
        state.eliminated = [];
    }
    if (state.eliminated.length >= 3) state.gameOver = true;
    eliminations.innerHTML = "<strong>Eliminations:</strong>";
    if (state.eliminated.length > 0) {
        eliminations.style.display = "block";
        state.eliminated.forEach(playerName => {
            const line = document.createElement("div");
            line.textContent = playerName;
            eliminations.appendChild(line);
        });
    } else {
        eliminations.style.display = "none";
    }

    // --- Update each player UI ---
    Object.keys(state.playerTags).forEach(pid => {
        const playerName = state.playerTags[pid];
        const playerDiv = document.getElementById(pid);
        const statusDiv = playerDiv.querySelector(".status");

        if (state.eliminated.includes(playerName)) {
            playerDiv.classList.add("eliminated"); 
            if (statusDiv) statusDiv.textContent = "Eliminated.";
        } else {
            playerDiv.classList.remove("eliminated");
        }
    });
    if (state.eliminated.length > 0) {
        const lastElim = state.eliminated[state.eliminated.length - 1];
        announceElimination.textContent = `${lastElim} was just Eliminated`;
        announceElimination.style.display = "block";

        setTimeout(() => {
            announceElimination.style.display = "none";
        }, 2000);
    }
});

// Keep state.playerTags updated with all joined players
db.ref("players").on("value", snapshot => {
    const players = snapshot.val() || {};
    state.playerTags = {}; // reset

    Object.keys(players).forEach(pid => {
        state.playerTags[pid] = players[pid].name;
    });

    // Update player UI
    Object.keys(state.playerTags).forEach(pid => {
        const playerDiv = document.getElementById(pid);
        if (!playerDiv) return;
        const nameDiv = playerDiv.querySelector(".playerName");
        if (nameDiv) nameDiv.textContent = state.playerTags[pid];
    });
});

db.ref("players").on("value", snapshot => {
    const players = snapshot.val() || {};
    const playerCount = Object.keys(players).length;
    let positions = state.OGpositions.slice();
    for (let i = 1; i <= 4; i++) {
        const playerID = `p${i}`;
        const playerDiv = document.getElementById(`p${i}`);

        if (players[playerID]) {
            const nameDiv = playerDiv.querySelector(".playerName");
            const statusDiv = playerDiv.querySelector(".status");
            const scoreDiv = playerDiv.querySelector(".playerScore");

            // Set player name
            if (nameDiv) nameDiv.textContent = players[playerID].name;

            // Initialize status and score if empty
            if (statusDiv) statusDiv.textContent = "Choosing...";
            if (scoreDiv) scoreDiv.textContent = "Score: " + (state.scores[players[playerID].name] || 0);

            playerDiv.style.visibility = "visible";

            if (playerID === state.myPlayerID) {
                playerDiv.style.bottom = "70px";
                playerDiv.style.left = "50%";  // centered
                playerDiv.style.transform = "translateX(-50%)";
            } else {
                const pos = positions.shift();
                playerDiv.style.bottom = pos.bottom || '';
                playerDiv.style.left = pos.left || '';
                playerDiv.style.right = pos.right || '';
                playerDiv.style.top = pos.top || '';
                playerDiv.style.transform = pos.transform || "";
            }
        } else {
            playerDiv.style.visibility = "hidden";

            const nameDiv = playerDiv.querySelector(".playerName");
            if (nameDiv) nameDiv.textContent = "";

            const statusDiv = playerDiv.querySelector(".status");
            if (statusDiv) statusDiv.textContent = "";

            playerDiv.removeAttribute("style");
            delete state.playerTags[playerID];
        }
    }

    // Waiting message
    if (playerCount < 4) {
        startRoundBtn.style.display = "none";
        state.missingList.textContent = "Waiting for " + (4 - playerCount) + " more player(s)";
        pickNumText.style.display = 'none';
        chooseNumberBtn.style.display = 'none';
        db.ref("game/roundStartTime").remove();
    } else {  // if four playuers have all joined.
        state.missingList.textContent = "";
        pickNumText.style.display = 'block';
        startRoundBtn.style.display = 'block';
    }
});