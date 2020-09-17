const CONSTANTS = {
  primaryGridSelector: '.primary-grid'
  , secondaryGridSelector: '.secondary-grid'
  , playerConnectButton: '#connect'
  , playerReadyButton: '#ready-to-play'
  , staticShips: [
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
    },
  ]
};

let playerNumber;

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
  ships.forEach( ship => placeShip(ship));
}

function attackEnemy(event, STATE) {
  if (STATE.turn === 'player') {
    event.target.style = 'background-color: red';    
  }
}

function connectPlayer() {
  const socket = io();

  socket.on('playerNumber', num => {
    if (num === -1) {
      console.log('There are already 2 players. Try again later.');
    } else {
      playerNumber = parseInt(num);  
    }    
  });

  socket.on('playerConnected', num => {
    console.log(`Player ${num} just connected!`);
  });
  
  socket.on('playerDisconnected', num => {
    console.log(`Player ${num} just disconnected!`);
  });

}

function readyToPlay() {

}

function initGame() {
  document.querySelector(CONSTANTS.playerConnectButton).addEventListener('click', connectPlayer);
  document.querySelector(CONSTANTS.playerReadyButton).addEventListener('click', readyToPlay);
  fillGrids();
  placeShips(CONSTANTS.staticShips);

}

function main() {
  initGame()
}

window.addEventListener('load', () =>  main());
