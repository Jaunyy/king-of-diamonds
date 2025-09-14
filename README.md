# King of Diamonds - Multiplayer Web Game

<img width="1903" height="897" alt="image" src="https://github.com/user-attachments/assets/d244ee02-de63-42fc-b4fa-a4de743b7aff" />


A web-based multiplayer game inspired by **[Alice in Borderland](https://aliceinborderland.fandom.com/wiki/King_of_Diamonds)**, specifically the "King of Diamonds" game.  
Adapted for **four players** so I could enjoy it with close friends.

---

## About the Game

Players choose numbers from 0 through 100 included per rounds to get as close as possible to a calculated target. Each round produces a winner and affects player scores.

### Rules (Simplified)

1. **Joining the Game:** Enter your name and join. Up to 4 players allowed.  
2. **Choosing Numbers:** Pick a number from the grid. Round progresses when everyone has chosen or time runs out.  
3. **Calculating the Result:**  
   - Compute the average of all chosen numbers.  
   - Multiply the average by **0.8** to get the target number.  
4. **Determining the Winner:** The player whose number is **closest to the target** wins the round.  
5. **Scoring:**  
   - Non-winners lose points.  
   - Players below -10 points are eliminated.  
6. **Eliminations & Advanced Rules:**  
   - Each eliminated player is intended to introduce a **new rule**, adding a twist to future rounds.  
---

## Features Implemented

- Multiplayer with **Firebase Realtime Database**  
- Dynamic **number grid selection**  
- Live **round updates** with countdown timers  
- Automatic calculation of round winner and score updates  
- Tracking of eliminations  

---

## Planned Features

- Full **elimination rules** (each eliminated player introduces a new twist)  
- Animations and visuals for immersive gameplay  
- Mobile responsiveness and sound effects  

---

## Techs Used

- HTML, CSS, JavaScript  
- **Firebase Realtime Database** for multiplayer game state  

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Jaunyy/king-of-diamonds.git

## Screenshots / Demo
- Waiting for Screen:
<img width="1898" height="898" alt="image" src="https://github.com/user-attachments/assets/89392d78-ed33-4af1-9cc5-c389c5693cab" />

- Game Screen:
<img width="1906" height="899" alt="image" src="https://github.com/user-attachments/assets/52358f6d-a6e2-4b6f-bbfa-e5833ebb6efc" />

- Number Selection:
<img width="1499" height="904" alt="image" src="https://github.com/user-attachments/assets/171675d2-7db5-4096-b929-8a6c7eaa9562" />

- Round Results:
<img width="1893" height="900" alt="image" src="https://github.com/user-attachments/assets/988f378c-31a6-486b-b43e-263a6c14e616" />

