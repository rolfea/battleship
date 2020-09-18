const CONSTANTS = {
  primaryGridSelector: '.primary-grid'
  , secondaryGridSelector: '.secondary-grid'
  , playerConnectButton: '#connect'
  , playerReadyButton: '#ready-to-play'
  , playerNumber: '#player-number'
};

let playerNumber;
let clientState;

function fillGrids() {
  fillPrimaryGrid();
  fillSecondaryGrid();
}

function fillPrimaryGrid() {
  let grid = getGrid(CONSTANTS.primaryGridSelector);  
  let squares = [];
  
  for (let i = 0; i < 100; i++) {
    squares.push(buildGridSquare());
  }

  squares.forEach((square) => grid.appendChild(square));
}

function fillSecondaryGrid() {
  let grid = getGrid(CONSTANTS.secondaryGridSelector);  
  let squares = [];
  
  for (let i = 0; i < 100; i++) {
    squares.push(buildGridSquare());
  }

  squares.forEach((square) => {
    square.addEventListener('click', attackEnemy);
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

function attackEnemy(event, STATE) {
  if (STATE.turn === 'player') {
    event.target.style = 'background-color: red';    
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

function initGame() {
  const socket = io();
  socket.on('STATE', STATE => {
    clientState = STATE;
    console.log('Updating state from server:');
    console.log(JSON.stringify(clientState));
    fillGrids();
    placeShips(clientState.ships);
  });
  
  document.querySelector(CONSTANTS.playerReadyButton)
          .addEventListener('click', () => readyToPlay(socket));
  
  tryConnectPlayer(socket);  
  
  

}

function main() {
  document.querySelector(CONSTANTS.playerConnectButton).addEventListener('click', initGame);
}

window.addEventListener('load', () =>  main());
