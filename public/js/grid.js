/*
grid.js
-------
Responsibilities:
    - Creates the grid and is placed within popUp (originally hidden)
    - Highlights which cell was selected and updates that information to moves in Firebase.
    - Updates the selecting status once chosen.
    - Automatically closes once button was chosen.

Notes:
    - Prevcell is tracked in order to show which cell was chosen. This is gone by the next round.
    - This stores moves locally and in Firebase.
    - Ensures the first 9 are unclickable because the real-based game had something similar.
*/

import { gridContainer, selectedDiv, popup } from './firebase.js';
import { state } from './state.js';
import { db } from './firebase.js';

for (let i = 0; i < 110; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    if (i < 9) {
        cell.classList.add('black'); // first 9 are black fillers
        cell.style.pointerEvents = "none"; // make them unclickable
    } else {
        cell.textContent = state.number;
        cell.dataset.number = state.number;

        cell.addEventListener('click', () => {
            if (state.prevcell) state.prevcell.classList.remove('clicked');    // gets rid of state.prevcell color. 
            state.prevcell = cell;
            cell.classList.add('clicked');
            selectedDiv.textContent = `Number Selected: ${cell.dataset.number}`;
            selectedDiv.dataset.number = cell.dataset.number;
            // Save locally
            state.moves[state.myPlayerID] = Number(cell.dataset.number);
            // Push to Firebase
            db.ref("moves/" + state.myPlayerID).set({name: state.myName, move: Number(cell.dataset.number)});
            db.ref("moves/" + state.myPlayerID).onDisconnect().remove();
            // Update local UI immediately
            const myDiv = document.getElementById(state.myPlayerID);
            const statusDiv = myDiv.querySelector(".status");
            if (statusDiv) statusDiv.textContent = "Has chosen!";
            popup.style.display = 'none';
        });

        state.number++;
    }
    gridContainer.appendChild(cell);
}