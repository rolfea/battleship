function fillGrid(x, y, gridClass) {
  let grid = document.querySelector(gridClass);  
  let squares = [];
  
  for (let i = 0; i < (x * y); i++) {
    squares.push(buildGridSquare());
  }

  squares.forEach((square) => grid.appendChild(square));
}

function buildGridSquare() {
  return document.createElement('div');
}

function main() {
  fillGrid(10, 10, '.primary-grid');
  fillGrid(10, 10, '.secondary-grid');
}

window.addEventListener('load', () =>  main());
