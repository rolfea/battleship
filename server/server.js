const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 8080
const app = express();
const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath));
const server = http.createServer(app);

server.on('error', () => console.log('an error!'));
server.listen(PORT, () => console.log(`Server Started on ${PORT}`));
const io = socketio(server);

// GAME STATE
// temporarily handle in memory, but we want to persist this in the DB eventually

let STATE = {
  winner: null
  , playerConnections: [null, null]
  , playersReady: [null, null]
  , playerTurn: 0
  , playerScores: [0, 0]
  , ships: [
    { 
      playerId: 0
      , shipLocations: [
        {
          name: 'carrier',
          positions: [0, 1, 2, 3, 4],
          color: 'black'
        },
        {
          name: 'battleship',
          positions: [45, 46, 47, 48],
          color: 'orange'
        },
        {
          name: 'destroyer',
          positions: [10, 20, 30],
          color: 'pink'
        },
        {
          name: 'submarine',
          positions: [33, 43, 53],
          color: 'tomato'
        },
        {
          name: 'patrol boat',
          positions: [99, 98],
          color: 'yellow'
        }
      ] 
    }
    , { 
      playerId: 1
      , shipLocations: [
        {
          name: 'carrier',
          positions: [0, 10, 20, 30, 40],
          color: 'black'
        },
        {
          name: 'battleship',
          positions: [46, 36, 26, 16],
          color: 'orange'
        },
        {
          name: 'destroyer',
          positions: [11, 21, 31],
          color: 'pink'
        },
        {
          name: 'submarine',
          positions: [33, 34, 35],
          color: 'tomato'
        },
        {
          name: 'patrol boat',
          positions: [9, 8],
          color: 'yellow'
        }
      ] 
    }
  ]
};

// SOCKET CONNECTION

io.on('connection', (socket) => {  
  let playerIndex = -1;
  for (const i in STATE.playerConnections) {
    if (STATE.playerConnections[i] === null) {
      playerIndex = i;
      STATE.playerConnections[i] = true;
      console.log(`Player ${playerIndex} has connected`);
      break;
    }
  } 

  // Identify player number to client
  socket.emit('playerNumber', playerIndex);

  if (playerIndex === -1) {
     return;
  }

  // notify of player connection
  socket.broadcast.emit('playerConnected', playerIndex);
  
  //notify of player disconnection
  socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} has disconnected`);
    STATE.playerConnections[playerIndex] = null; 
    socket.broadcast.emit('playerDisconnected', playerIndex);
  });

  //handle playerReady
  socket.on('playerReady', (num) => {
    STATE.playersReady[num] = true;
    console.log(`Player ${num} is ready to play.`, STATE);

    // both players ready?
    if (STATE.playersReady.every(e => e)) {
      socket.emit('initState', STATE);
      console.log('Both players ready. Sending STATE to client.')    
    }      
  });

  socket.on('attack', (targetId, hit) => {
    console.log('attack recieved!')
    if (hit) {
      STATE.playerScores[STATE.playerTurn]++;
      if (STATE.playerScores[STATE.playerTurn] > 17) {
        STATE.winner = STATE.playerTurn;
        io.emit('gameOver', STATE);
      }
    }
    STATE.playerTurn = STATE.playerTurn === 0 ? 1 : 0;
    io.emit('updateState', STATE);
    logState(STATE);
  });
});
 
function logState(state) {
  console.log(`STATE is now ${JSON.stringify(state)}`);
}