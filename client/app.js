const CONSTANTS = {
  primaryGridSelector: '.primary-grid'
  , secondaryGridSelector: '.secondary-grid'
  , playerConnectButton: '#connect'
  , playerReadyButton: '#ready-to-play'
  , playerNumberDisplay: '#player-number'
  , playerTurnDisplay: '#player-turn'
  , restartButton: '#restart'
  , messages: '#messages'
  , hitColor: 'red'
  , missColor: 'white'
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
    squares.push(buildGridSquare(i, 'primary'));
  }

  squares.forEach((square) => grid.appendChild(square));
}

function fillSecondaryGrid(socket) {
  let grid = getGrid(CONSTANTS.secondaryGridSelector);  
  let squares = [];
  
  for (let i = 0; i < 100; i++) {
    squares.push(buildGridSquare(i, 'secondary'));
  }

  squares.forEach((square) => {
    square.addEventListener('click', (event) => attackEnemy(event, socket));
    grid.appendChild(square);
  });
}

function getGrid(gridClass) {
  return document.querySelector(gridClass);
}

function buildGridSquare(id, parentGrid) {
  const square = document.createElement('div');
  square.setAttribute('id', `player-${playerNumber}-${parentGrid}-grid-${id}`);
  return square;
}

function placeShip(ship) {
  let gridSquares = getGrid(CONSTANTS.primaryGridSelector).children;  
  ship.positions.forEach(position => gridSquares[position].style = `background-color: ${ship.color};`);
}

function placeShips(ships) {
  ships.find(s => s.playerId === playerNumber).shipLocations
       .forEach(ship => placeShip(ship));
}

function hideRestartButton() {
  document.querySelector(CONSTANTS.restartButton).style ='visibility: hidden;';
}

function checkForHit(targetId) {
  // for now let's just check against the clientState
  // it will be necessary to prevent "cheating" to eventually push to the server
  // rather than broadcasting them to both players "under the hood"
  const enemyNumber = playerNumber === 0 ? 1 : 0;
  let hit;
  clientState.ships
    .filter(s => s.playerId === enemyNumber)[0]
    .shipLocations
    .forEach(s => s.positions.some(pos => {
      if (pos === targetId) {
        hit = true;        
      }      
    }));

  return hit;
}

function attackEnemy(event, socket) {  
  if (clientState.playerTurn === playerNumber) {
    const targetId = parseInt(event.target.id.split(`player-${playerNumber}-secondary-grid-`)[1]); 
    const hit = checkForHit(targetId)
    if (hit) {
      event.target.style = `background-color: ${CONSTANTS.hitColor}`;    
    } else {
      event.target.style = `background-color: ${CONSTANTS.missColor}`;
    }
    
    socket.emit('attack', targetId, hit);    
  }     
}

function tryConnectPlayer(socket) {
  socket.on('playerNumber', num => {
    if (num === -1) {
      console.log('There are already 2 players. Try again later.');
    } else {
      playerNumber = parseInt(num);  
      document.querySelector(CONSTANTS.playerNumberDisplay)
              .innerText += ` ${playerNumber + 1}`;
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
  document.querySelector(CONSTANTS.playerTurnDisplay)
          .innerText = `Player Turn: ${clientState.playerTurn + 1}`
}

function updateGameState(state) {
  clientState = state;
  updatePlayerTurn();
  console.log('Updating state from the server:', clientState);
}

function finishGame() {
  document.querySelector(CONSTANTS.messages)
          .innerText = `Player ${clientState.winner + 1} Wins!`
  let restartButton = document.querySelector(CONSTANTS.restartButton).style = 'visibility: visible;';
}

function initGame() {
  const socket = io();
  socket.on('initState', STATE => {
    clientState = STATE;
    console.log('Getting initial state from server:');

    fillGrids(socket);
    placeShips(clientState.ships);
    hideRestartButton();
    updatePlayerTurn();
  });

  socket.on('updateState', STATE => {
    updateGameState(STATE);
  });

  socket.on('gameOver', STATE => {
    updateGameState(STATE);
    finishGame();
  });
  
  document.querySelector(CONSTANTS.playerReadyButton)
          .addEventListener('click', () => readyToPlay(socket));
  
  tryConnectPlayer(socket);  
}

function main() {
  document.querySelector(CONSTANTS.playerConnectButton)
          .addEventListener('click', initGame);
}

window.addEventListener('load', () =>  main());
