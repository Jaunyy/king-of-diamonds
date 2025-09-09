# King of Diamonds - Multiplayer Web Game

![King of Diamonds](path/to/cover-image.png) <!-- Replace with a cover image if you have one -->

A web-based multiplayer game inspired by **[Alice in Borderland](https://aliceinborderland.fandom.com/wiki/King_of_Diamonds)**, specifically the "King of Diamonds" game.  
Adapted for **four players** so I could enjoy it with close friends.

---

## About the Game

Players choose numbers in rounds to get as close as possible to a calculated target. Each round produces a winner and affects player scores.

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
   - This feature is **planned but not yet implemented**.  

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
- Join Screen:
<img width="1287" height="773" alt="image" src="https://github.com/user-attachments/assets/92afec71-2118-4211-b29c-78033b081ad4" />

- Game Screen:
<img width="1903" height="894" alt="image" src="https://github.com/user-attachments/assets/c6365212-f328-43b7-948e-a237d3baa2e0" />

- Number Selection:
<img width="1441" height="886" alt="image" src="https://github.com/user-attachments/assets/624a734f-b8ca-448a-b882-bf07453edb73" />

- Round Results:
<img width="938" height="863" alt="image" src="https://github.com/user-attachments/assets/9b75fcdf-1f56-46ce-92a4-d587e02a4d32" />
