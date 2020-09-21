# Battleship

Battleship!

This is a two player Battleship implementation. Both players have their own browser window and play against each other in real time.

[Rules and History](https://en.wikipedia.org/wiki/Battleship_%28game%29)

## Try This Out

Setup and Run Instructions Here

## Features

2 Players
5 Ships, randomly placed
Win Detection

### Front End

[x] 10x10 Ship Placement Grid  
[x] 10x10 Shot Tracking Grid  
[x] ship Represented  
[x] different Sized Ships  
[x] shot mechanic  
[x] hit vs miss mechanic  
[] player Sink Mechanic  
[] opponent Sink Mechanic  
[x] Win/Loss Display  
[x] Whose Turn Is It (logic/display)  

### Back End

[x] start game  
[] build random ship placement  
[] game state table  
[x] win detection

### Bugs/Improvements

[] 1 Player can connect 2x, locking out a second a player
[] player can attack an already attacked square. we track "hit squares" on the
  back end and check onHit if the id has already been submitted to prevent this
[] need to handle disconnects
[] notify player when they sink an opponent's ship
[] win condition is a little rigid, doesn't leave room for additional boats, for example

### Stretch Goals

* Deploy to AWS (Build, Test, Deploy)
* Beautiful UI/UX (sounds, colors, effects)
* Browser Compatibility
* Responsive Design

### Out of Scope (for now)

* Auth
* Replay
* General Security (leaving the API open)
* Custom ship placement
* Play against computer
* Player Chat

## Reference

These are things I referred to while I worked on this.
