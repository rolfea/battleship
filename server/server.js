const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const clientPath = `${__dirname}/../client`;
console.log(`Client Path is ${clientPath}`)
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (socket) => {
  console.log('connection started');
  socket.emit('message', 'Connection successful');
});

server.on('error', () => {
  console.log('an error!');
});

server.listen(8080, () => {
  console.log('TEST - Started Server on 8080');
});

