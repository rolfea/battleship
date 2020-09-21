# Dev Notes

I have the server end working so I'll call this my first "milestone," and pause here. I was hoping to set up an ORM and move the state from an in-memory thing on the server into a table that tracked the game state. I have a solid idea on how I want to initially approach this, which I'll write up briefly below here.

Probably the biggest initial blocker was getting stuck on using socket.io to emit an updated game state to both connected players. The solution ended up being simple (use `io.emit()`, not `socket.emit()`) but I spun my wheels a bit there. Other than that this has felt relatively smooth.  

Next step is implementing the DB layer, as I mention above. After that I think moving through some bugs and basic improvements that I documented in the README would be best.  

Following those updates, past experience tells me that the next most important things are getting some automated testing set up and then making sure the app is actually deployable. I can do this manually into AWS or Heroku, or I could take the opportunity to containerize the app with Docker and finally learn more about AWS ECS and dealing with containers in general.  

Once that pipeline is set up, I'd feel comfortable swapping in a client library, most likely React with TypeScript, and adding Babel and TypeScript to the server. Once that foundation is in place, I can start to pull "Out of Scope" items in to implement. Repeat and profit! :sweat_smile:  

## DB Implementation Idea

To start, I think I could just use a single table, GameState, like so:

| MatchId  | TurnNumber  | State   |
|:--------:|:-----------:|:-------:|
| int      | int         | JSON    |

I've had luck using JSON data type with MS-SQL before, so I think that this could work well with Postgres as well. Then I can just write the state that I currently have in memory onto the table without needing to add much complexity to the server in terms of reconstructing the game state from a set of tables.  

## 9/20/2020

### Server

[x] server sends state to client on ready from both players  
[x] draw initial grids w/ generated ship positions  
[x] click board create "attack" and changes player turn  
[x] display hit vs. miss  
[x] win condition logic  
~[] restart mechanic~ punting on this in favor of cleaning things up  

### DB

[] set up DB and DB communication layer  

## 9/17/2020

I finally have more time to work on this today! I'm going to try to power through a bunch of work. Things will be in a good state if I can finish this all.

### Server

[x] server sends state to client on ready from both players  
[x] draw initial grids w/ generated ship positions  
[x] click board create "attack" and changes player turn  
[] display hit vs. miss  
[] win condition logic  
[] restart mechanic  

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
