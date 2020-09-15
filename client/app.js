const CONSTANTS = {
  primaryGridSelector: '.primary-grid'
  , secondaryGridSelector: '.secondary-grid'
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

let STATE = {
  turn: '1'
  ,
};

function fillGrid(x, y, gridClass) {
  let grid = getGrid(gridClass);  
  let squares = [];
  
  for (let i = 0; i < (x * y); i++) {
    squares.push(buildGridSquare());
  }

  squares.forEach((square) => grid.appendChild(square));
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

function main() {
  fillGrid(10, 10, CONSTANTS.primaryGridSelector);
  fillGrid(10, 10, CONSTANTS.secondaryGridSelector);

  placeShips(CONSTANTS.staticShips);
}

window.addEventListener('load', () =>  main());
