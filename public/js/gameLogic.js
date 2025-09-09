/*
gameLogic.js
------------
Responsibilities:
    - findWinner(playerMoves): calculates the winner based on player moves and the King's number.
    - handleLosses(playerMoves, winner): updates scores, handles eliminations, and syncs with Firebase.
    - resetGame(): resets game state, Firebase data, and UI elements for a new game.
    - playGame(): retrieves moves and player data from Firebase, calculates winner.
    - updateScores(): updates the scores locally/

Notes:
    - Eliminated players are tracked in state.eliminated.
    - Scores are stored in Firebase under 'scores'.
    - Moves are stored in Firebase under 'moves'.
    - Intended to be used with the main.js game loop.
*/
import { db, selectedDiv} from './firebase.js';
import { state } from './state.js';

export function findWinner(playerMoves){
    let total = 0;
    const names = Object.keys(playerMoves);
    //globalAvg = 0;
    let count = 0;
    names.forEach (name => {
        if (playerMoves[name] !== -1) {
            total += playerMoves[name]
            count++;
        }
    });
    if (count === 0) {
        handleLosses(playerMoves, "");
        return "";
    }
    // globalAvg = (total / count);
    // globalAvg.toFixed(2);
    const result = (total / count)  *  state.KINGS_NUMBER;

    let minDiff = Infinity;
    let winner = "";
    names.forEach (name => {
        if (playerMoves[name] !== -1) {
            const diff = Math.abs(playerMoves[name] - result);
            if (diff < minDiff) {minDiff = diff; winner = name;}
        }
    });
    handleLosses(playerMoves, winner);
    if (state.eliminated.length === 3 && !state.eliminated.includes(winner)){
        const listWinner = document.createElement("p");
        listWinner.style.display = 'block';
        listWinner.textContent = "Congratulations " + winner + " you defeated the King of Diamonds!";
        document.body.appendChild(listWinner);
    }
    return winner;
}

export function handleLosses(playerMoves, winner) {
    const names = Object.keys(playerMoves);
    names.forEach(name => {
        if (!(name in state.scores)) state.scores[name] = 0;
        
        if ((winner !== "" && name !== winner && !state.eliminated.includes(name)) || (playerMoves[name] === -1 && !state.eliminated.includes(name))) {
            state.scores[name] -= 1;
        }
        if (state.scores[name] <= -10 && !state.eliminated.includes(name)) {
            state.eliminated.push(name);
            db.ref("eliminated").set(state.eliminated); // store full updated list
        }
    });

    db.ref('scores').set(state.scores);
    updateScores();
}

export function resetGame() {
    // Reset local state
    state.scores = {};
    state.eliminated = [];

    // Clear Firebase data
    db.ref('scores').set({});
    db.ref('eliminated').set([]);
    db.ref('moves').set({});

    // Reset UI elements
    document.getElementById("winner").innerText = "";
    document.getElementById("eliminations").innerHTML = "";
    selectedDiv.textContent = "Selected Number: None";
    db.ref("game/roundStartTime").remove();
    // Reset player bubbles dynamically
    if (state.playerTags) {
        Object.keys(state.playerTags).forEach(tag => {
            const playerDiv = document.getElementById(tag);
            if (playerDiv) {
                let scoreDiv = playerDiv.querySelector(".playerScore");
                if (!scoreDiv) {
                    scoreDiv = document.createElement("div");
                    scoreDiv.classList.add("playerScore");
                    playerDiv.appendChild(scoreDiv);
                }
                scoreDiv.textContent = "Score: 0";
            }
        });
    }
}

export function playGame() {
    return Promise.all([
        db.ref("moves").once("value"),
        db.ref("players").once("value")
    ]).then(([movesSnap, playersSnap]) => {
        const movesData = movesSnap.val() || {};
        const players = playersSnap.val() || {};
        
        let playerMoves = {};
        Object.keys(players).forEach(pid => {
            const pname = players[pid].name;
            playerMoves[pname] = movesData[pid].move;
        });

        return findWinner(playerMoves);
    });
}

function updateScores() {
    const tags = Object.keys(state.playerTags); 
    tags.forEach(tag => {
        const playerName = state.playerTags[tag];       // get player name
        const playerDiv = document.getElementById(tag);   
        if (!playerDiv) return;
        
        let scoreDiv = playerDiv.querySelector(".playerScore");
        if (!scoreDiv) {
            scoreDiv = document.createElement("div");
            scoreDiv.classList.add("playerScore");
            playerDiv.appendChild(scoreDiv); 
        }
        scoreDiv.textContent = "Score: " + (state.scores[playerName] || 0);  // updates scores locally.
    });
}