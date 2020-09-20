const CONSTANTS = {
  primaryGridSelector: '.primary-grid'
  , secondaryGridSelector: '.secondary-grid'
  , playerConnectButton: '#connect'
  , playerReadyButton: '#ready-to-play'
  , playerNumber: '#player-number'
  , playerTurn: '#player-turn'
};

let playerNumber;
let clientState;

function fillGrids(socket) {
  fillPrimaryGrid();
  fillSecondaryGrid(socket);
}

function fillPrimaryGrid() {
  let grid = getGrid(CONSTANTS.primaryGridSelector);  
  let squares = [];
  
  for (let i = 0; i < 100; i++) {
    squares.push(buildGridSquare());
  }

  squares.forEach((square) => grid.appendChild(square));
}

function fillSecondaryGrid(socket) {
  let grid = getGrid(CONSTANTS.secondaryGridSelector);  
  let squares = [];
  
  for (let i = 0; i < 100; i++) {
    squares.push(buildGridSquare());
  }

  squares.forEach((square) => {
    square.addEventListener('click', (event) => attackEnemy(event, socket));
    grid.appendChild(square);
  });
}

function getGrid(gridClass) {
  return document.querySelector(gridClass);
}

function buildGridSquare() {
  return document.createElement('div');
}

function placeShip(ship) {
  let gridSquares = getGrid(CONSTANTS.primaryGridSelector).children;  
  ship.positions.forEach(position => gridSquares[position].style = `background-color: ${ship.color};`);
}

function placeShips(ships) {
  ships.find(s => s.playerId === playerNumber).shipLocations
       .forEach(ship => placeShip(ship));
}

function attackEnemy(event, socket) {  
  if (clientState.playerTurn === playerNumber) {
    console.log(`player ${playerNumber} attacks ${event.target.id}!`);
    // check other player's ship array for hit
    event.target.style = 'background-color: red';    
    socket.emit('attack', event.target.id);
    console.log(clientState);  
  } else {
    console.log('not your turn!');
  }   
}

function tryConnectPlayer(socket) {
  socket.on('playerNumber', num => {
    if (num === -1) {
      console.log('There are already 2 players. Try again later.');
    } else {
      playerNumber = parseInt(num);  
      document.querySelector(CONSTANTS.playerNumber).innerText += ` ${playerNumber + 1}`;
    }    
  });

  socket.on('playerConnected', num => {
    console.log(`Player ${num} just connected!`);    
  });
  
  socket.on('playerDisconnected', num => {
    console.log(`Player ${num} just disconnected!`);
  });
}

function readyToPlay(socket) {
  socket.emit('playerReady', playerNumber);
}

function updatePlayerTurn() {
  document.querySelector(CONSTANTS.playerTurn).innerText = `Player Turn: ${clientState.playerTurn + 1}`
}

function updateGameState(state) {
  clientState = state;
  updatePlayerTurn();
  console.log('Updating state from the server:', clientState);
}

function initGame() {
  const socket = io();
  socket.on('initState', STATE => {
    clientState = STATE;
    console.log('Getting initial state from server:');

    fillGrids(socket);
    placeShips(clientState.ships);
    updatePlayerTurn();
  });

  // listen for any subsequent updates to state from the server
  socket.on('updateState', STATE => {
    updateGameState(STATE);
  });
  
  document.querySelector(CONSTANTS.playerReadyButton)
          .addEventListener('click', () => readyToPlay(socket));
  
  tryConnectPlayer(socket);  
}

function main() {
  document.querySelector(CONSTANTS.playerConnectButton).addEventListener('click', initGame);
}

window.addEventListener('load', () =>  main());
