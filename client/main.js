'use strict';

const socket = io();
const board = document.querySelector('.board');
const status = document.querySelector('.status');
let gameState;
/////////////////////////////////////////

let nextPlayer = 'X';

// let boardState = [
//   ['','',''],
//   ['','',''],
//   ['','','']
// ];


const renderStatus = (gameObj) => {
  status.innerText = `It is ${gameObj.nextMove}'s turn.`;
}

const renderBoard = (boardState) => {
  document.querySelector('.board').innerHTML = `
    <table>
      <tr>
        <td>${boardState[0][0]}</td>
        <td>${boardState[0][1]}</td>
        <td>${boardState[0][2]}</td>
      </tr>
      <tr>
        <td>${boardState[1][0]}</td>
        <td>${boardState[1][1]}</td>
        <td>${boardState[1][2]}</td>
      </tr>
      <tr>
        <td>${boardState[2][0]}</td>
        <td>${boardState[2][1]}</td>
        <td>${boardState[2][2]}</td>
      </tr>
    </table>
  `;
};


//Add event listener to the entire game board
board.addEventListener('click', evt => {

  const col = evt.target.cellIndex;
  const row = evt.target.closest('tr').rowIndex;

  if (gameState[row][col]) {
    return console.log('Cannot move there');
  }

  socket.emit('make move', { row, col })

  gameState[row][col] = nextPlayer;
  nextPlayer = nextPlayer === 'X' ? 'O': 'X';
  renderBoard(gameState);

  console.log('You clicked on : ', row, col);

  status.innerText = `It is ${nextPlayer}'s turn.`;
});

const render = (gameObj) => {
  renderStatus(gameObj);
  renderBoard(gameObj.board);
}

//Socket listeners
socket.on('connect', () => console.log("User connected"));
socket.on('disconnect', () => console.log("User disconnected"));
socket.on('error', console.error);
socket.on('new game', (game) => {
  gameState = game.board;
  //Draw the board at start of game
  render(game);
  console.log("Test text", game.board);
});
socket.on('move made', (game) => {
  gameState = game.board;
  //Draw the board after a move has been made
  render(game);
});
