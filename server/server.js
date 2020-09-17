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

// socket connection

const playerConnections = [null, null]; // only two players can connect

io.on('connection', (socket) => {  
  let playerIndex = -1;
  for (const i in playerConnections) {
    if (playerConnections[i] === null) {
      playerIndex = i;
      playerConnections[i] = i;
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
    playerConnections[playerIndex] = null; 
    socket.broadcast.emit('playerDisconnected', playerIndex);
  })
});
 
