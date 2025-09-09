/*
firebase.js
------------
Firebase configuration and initialization as well as exporting global DOM elements 
used throughout the game screens.

Responsibilities:
    - Initialize Firebase app and database
    - Export Firebase database reference (db)
    - Export key DOM elements for the join screen, game screen, popups, grids,
        buttons, countdown timer, and elimination announcements
    - Provides a central location for global variables used in multiple modules

Notes:
    - All exported elements correspond to IDs in index.html
    - Ensures other modules can import and manipulate these elements consistently
*/
const firebaseConfig = {
    apiKey: "AIzaSyD0WlA_2IEzYwavt_Dtm6NUr_vu2kpuvaU",
    authDomain: "kingofdiamonds-c5967.firebaseapp.com",
    databaseURL: "https://kingofdiamonds-c5967-default-rtdb.firebaseio.com",
    projectId: "kingofdiamonds-c5967",
    storageBucket: "kingofdiamonds-c5967.appspot.com",
    messagingSenderId: "872745210340",
    appId: "1:872745210340:web:be3f6bf228dcac81c9f7f1",
    measurementId: "G-LMNG7S6E6H"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database();

export const startRoundBtn = document.getElementById('startRoundBtn');
export const joinScreen = document.getElementById('joinScreen');
export const gameScreen = document.getElementById('gameScreen');
export const joinBtn = document.getElementById('joinBtn');
export const popup = document.getElementById('popup');
export const gridContainer = document.getElementById('gridContainer');
export const selectedDiv = document.getElementById('selected');                 // This holds the div necessary to edit the player's local game screen.
export const chooseNumberBtn = document.getElementById('chooseNumberBtn');
export const closeBtn = document.getElementById('closePopup');
export const pickNumText = document.getElementById("pickNumText");
export const countdownTimer = document.getElementById("countdownTimer");
export const eliminations = document.getElementById("eliminations");
export const announceElimination = document.getElementById("announceElimination");

