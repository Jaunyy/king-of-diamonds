/*
state.js
--------
Centralized state management. This object is imported by ui.js, gameLogic.js, listeners.js, main.js, and grid.js
to keep track of player info, game moves, scores, and DOM references.

state properties:
    - myPlayerID, myName: current player's ID and name
    - playerTags: mapping of player IDs to names
    - moves, currMoves: track current round moves
    - chosenCount: number of players who have chosen
    - scoringDone: flag indicating if scoring has been computed
    - gameOver, gameWinner, eliminated: track game progress
    - timerInterval: stores interval for round timer
    - prevcell, number: track last clicked grid cell and current number
    - scores: mapping of player names to their scores
    - KINGS_NUMBER: constant multiplier for computing round results
    - missingList: DOM element showing waiting players
    - OGpositions: preset positions for player cards in the UI

Notes:
    - Acts as a single source of truth for all game modules as it's always edited/read.
    - Ensures consistent state management across files
*/
export const state = {
    // Player info
    myPlayerID: null,
    myName: null,
    playerTags: {},
    
    // Game moves & tracking
    moves: {},
    currMoves: {},
    chosenCount: 0,
    scoringDone: false,
    
    // Game status
    gameOver: false,
    gameWinner: "",
    eliminated: [],
    
    // Misc
    timerInterval: null,
    prevcell: null,
    number: 0,
    scores: {},
    
    // Constants
    KINGS_NUMBER: 0.8,
    
    // DOM references
    missingList: document.getElementById("waitingForPlayers"),
    OGpositions: [
        { top: "20px", left: "50%", transform: "translateX(-50%)" }, // top center
        { top: "44.6%", right: "40px" }, // right side
        { top: "44.6%", left: "40px" }   // left side
    ]
};
