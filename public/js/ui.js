/*
roundAnnouncements.js
---------------------
Handles displaying and managing round results and messages in the game

Responsibilities:
    - appendMessage(msg): appends a message to the round countdown area in the UI.
    - clearMessages(): clears old messages at the start of a new round.
    - startNewRound(): resets the round timer and updates Firebase with the new round start time.

Notes:
    - Used by main.js to update the game UI after each round.
    - Relies on Firebase real-time databse to track round start time.
*/

import { db } from './firebase.js';

// Appends message to the main text per round.
export function appendMessage(msg) {
    const line = document.createElement("div");
    line.textContent = msg;
    countdownTimer.appendChild(line);
}

// Clear old messages when starting a new round.
export function clearMessages() {
    countdownTimer.innerHTML = "";
}

// Resets the timer once the new round once the start round button is clicked.
export function startNewRound() {
    db.ref("game/roundStartTime").set(firebase.database.ServerValue.TIMESTAMP);
}
