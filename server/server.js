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
  turn: 'player' // player/enemy
  , winner: false
  , playerConnections: [null, null]
  , playersReady: [null, null]
};

// SOCKET CONNECTION

io.on('connection', (socket) => {  
  let playerIndex = -1;
  for (const i in STATE.playerConnections) {
    if (STATE.playerConnections[i] === null) {
      playerIndex = i;
      STATE.playerConnections[i] = true;
      console.log(`Player ${playerIndex} has connected`);
      logState(STATE);      
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
    console.log(`Player ${num} is ready to play.`);
    logState(STATE);

    // generate player ships
  })
});
 
function logState(state) {
  console.log(`STATE is now ${JSON.stringify(state)}`);
}