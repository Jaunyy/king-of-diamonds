/*
main.js
--------
Manages the real-time round timer and announcements for the 
game.

Responsibilities:
    - Listens for changes to 'game/roundStartTime' in Firebase
    - Controls the countdown and round phases
    - Reveals player moves, average, result, and winner sequentially
    - Updates UI messages and selected numbers dynamically
    - Handles end-of-round and new round initiation
    - Interacts with gameLogic.js to compute round winners
    
Notes:
    - Uses fixed time durations for each phase (choose, break, reveal, etc.)
    - Supports up to 4 players
    - Relies on Firebase for real-time synchronization of moves and round state
    - Reveals each player's choice and the closest-to-result winner in sequence
    - Automatically starts a new round after the current round finishes
    - Still need to work on new rules per player eliminated.
*/        
import { db, startRoundBtn, pickNumText, countdownTimer, chooseNumberBtn, selectedDiv } from './firebase.js';
import { startNewRound, clearMessages, appendMessage } from './ui.js';
import { playGame } from './gameLogic.js';
import { state } from './state.js';
import './grid.js';
import './listeners.js';


db.ref("game/roundStartTime").on("value", snapshot => {
    state.gameOver = false;
    pickNumText.style.display = 'none';
    startRoundBtn.style.display = "none";
    const startTime = snapshot.val();
    if (!startTime) {
        countdownTimer.textContent = "";
        chooseNumberBtn.style.display = "none";
        return;
    }
    const TEST_SPEED = 1;
    const chooseDuration = 15000 * TEST_SPEED;
    const breakDuration = 26000 * TEST_SPEED;
    const timesUpDuration = 18000 * TEST_SPEED;
    const player1Duration = 20000 * TEST_SPEED;
    const player2Duration = 22000 * TEST_SPEED;
    const player3Duration = 24000 * TEST_SPEED;
    const player4Duration = 26000 * TEST_SPEED;
    const avgDuration = 29000 * TEST_SPEED;
    const multDuration = 32000 * TEST_SPEED;
    const closestPlayerDuration = 37000 * TEST_SPEED;
    const newRoundBreakDuration = 41000 * TEST_SPEED;
    let revealed = {
        timesUp: false,
        p1: false,
        p2: false,
        p3: false,
        p4: false,
        avg: false,
        result: false,
        winner: false
    };

    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        if (elapsed < chooseDuration) {
            countdownTimer.style.display = "block";
            countdownTimer.textContent = Math.ceil((chooseDuration - elapsed) / 1000);
            chooseNumberBtn.style.display = (!state.eliminated.includes(state.playerTags[state.myPlayerID])) ? "block" : "none";
            startRoundBtn.style.display = "none";
        }
        else if (elapsed < chooseDuration + breakDuration) {
            // break phase;
            let count = 0;
            let sum = 0;
            Object.keys(state.currMoves).forEach(name => {
                if (state.currMoves[name] !== -1) {
                    sum += state.currMoves[name];
                    count++;
                }
            });
            let avg = (count > 0) ? (sum / count) : 0;
            if (elapsed < timesUpDuration) {
                if (!revealed.timesUp) {
                    clearMessages();
                    appendMessage("Time's up!");
                    chooseNumberBtn.style.display = 'none';
                    revealed.timesUp = true;
                }
            } else if (elapsed < player1Duration) {
                if (state.eliminated.includes(state.playerTags["p1"])) {      // ensure that state.eliminated players dont show up in the round announcements
                    elapsed = player1Duration;
                }
                else if (!revealed.p1) {
                    clearMessages();
                    if (state.moves["p1"] === -1) appendMessage(`${state.playerTags["p1"]} did not make a choice.`);
                    else appendMessage(`${state.playerTags["p1"]} chose ${state.moves["p1"]}`);
                    revealed.p1 = true;
                }
            } else if (elapsed < player2Duration) {
                if (state.eliminated.includes(state.playerTags["p2"])) {
                    elapsed = player2Duration;
                }
                else if (!revealed.p2) {
                    if (state.moves["p2"] === -1) appendMessage(`${state.playerTags["p2"]} did not make a choice.`);
                    else appendMessage(`${state.playerTags["p2"]} chose ${state.moves["p2"]}`);
                    revealed.p2 = true;
                }
            } else if (elapsed < player3Duration) {
                if (state.eliminated.includes(state.playerTags["p3"])) {
                    elapsed = player3Duration;
                }
                else if (!revealed.p3) {
                    if (state.moves["p3"] === -1) appendMessage(`${state.playerTags["p3"]} did not make a choice.`);
                    else appendMessage(`${state.playerTags["p3"]} chose ${state.moves["p3"]}`);
                    revealed.p3 = true;
                }
            } else if (elapsed < player4Duration) {
                if (state.eliminated.includes(state.playerTags["p4"])) {
                    elapsed = player4Duration;
                }
                else if (!revealed.p4) {
                    if (state.moves["p4"] === -1) appendMessage(`${state.playerTags["p4"]} did not make a choice.`);
                    else appendMessage(`${state.playerTags["p4"]} chose ${state.moves["p4"]}`);
                    revealed.p4 = true;
                }
            } else if (elapsed < avgDuration) {
                if (!revealed.avg) { 
                    appendMessage(`The average was: ${avg.toFixed(2)}`);
                    revealed.avg = true;
                }
            } else if (elapsed < multDuration) {
                if (!revealed.result) {
                    clearMessages();
                    let ans = (avg * 0.8).toFixed(2);
                    appendMessage(`The result is ${avg.toFixed(2)} * 0.8 = ${ans}`);
                    revealed.result = true;
                }

            } else if (elapsed < closestPlayerDuration) {
                if (!revealed.winner) {
                    if (!state.scoringDone) {
                        state.scoringDone = true;
                        playGame().then(Roundwinner => {
                            if (Roundwinner === "" || Roundwinner === null) appendMessage("So we all want to die huh?");
                            else {
                                appendMessage(`The player closest to the result was ${Roundwinner}`);
                                state.gameWinner = Roundwinner;
                            }
                        });
                    }                    
                    revealed.winner = true;
                }
            }
            // Compute winner only once
            else if (elapsed < newRoundBreakDuration) {
                if (state.gameOver) {
                    clearInterval(state.timerInterval);
                    countdownTimer.textContent = (`Congratulations ${state.gameWinner}, you have defeated the King of Diamonds`);
                    return;
                }
                countdownTimer.textContent = "New round begins in " + Math.ceil((chooseDuration + breakDuration - elapsed) / 1000);
                // resets the status
                const myDiv = document.getElementById(state.myPlayerID);
                const statusDiv = myDiv.querySelector(".status");
                if (statusDiv) {
                    db.ref("moves/" + state.myPlayerID).set({name: state.myName, move: -1}); // firebasely  : status
                    statusDiv.textContent = "Choosing...";    // locally   : status
                    selectedDiv.textContent = "Number Selected: None";    // locally : num selected.
                    if (state.prevcell) state.prevcell.classList.remove('clicked');
                }
                state.scoringDone = false;
                revealed.winner = false;
            }                    
        }
        else {
            // starting next round
            clearInterval(state.timerInterval);
            state.scoringDone = false;
            startNewRound();
        }
    }, 250);
});

