# Dev Notes

## 9/17/2020

I finally have more time to work on this today! I'm going to try to power through a bunch of work. Things will be in a good state if I can finish this all.

### server

[x] server sends state to client on ready from both players
[x] draw initial grids w/ generated ship positions
[] click board create "attack" and changes player turn
[] display hit vs. miss
[] win condition logic
[] restart mechanic

### DB

[] Set up server with controller for client to use
[] set up DB and DB communication layer

## 9/15/2020

Today I want to scaffold out the back end and get it talking to the front end. Ideally we'll arrive at a pattern that takes the game state, tracks it in a DB, and then updates both players in real time with socket.io. It occurs to me that maybe the socket.io layer could use an observable pattern like RxJS, so whether I need to bring in a library like that remains an open question.

### TODO List

[x] set up socket.io messaging
[x] establish communication between server and front end
[x] both players ready

## 9/14/2020

Starting the first chunk of work today. The first step is to define the parameters and limitations of what I can do here:

Goal: A two player battleship game with a functional backend. Each player plays in their own browser window.

Front End: POC in HTML5, CSS, JS, then convert to React if time  
Back End: Node with JS/TypeScript  
DB: SQL (Postgres)  
Client to Server Communication: Socket.IO  

### TODO List

[x] Define features for client and server in README  
[x] Build out basic client  
  [x] build primary/secondary grids
  [x] static placement of ships for UI testing
  [x] shot tracker

## Next Steps

Basic UI is established, and I think rather than going farther into game logic, I will start to look at the server work. I don't want to get too far into a POC version UI, and I want to solve some things with the API that I anticipate next.
