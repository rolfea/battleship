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
  for (const i in playerConnections) { // pull to separate function?
    if (playerConnections[i] === null) {
      playerIndex = i;
      playerConnections[i] = i;
      break;
    }
  } 

  if (playerIndex === -1) {
    return;
  }

  // Identify player number to client
  socket.emit('playerNumber', playerIndex);

  console.log(`Player ${playerIndex} has connected`)
});
 
