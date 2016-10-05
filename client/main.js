'use strict';

const socket = io();
const board = document.querySelector('.board');
const status = document.querySelector('.status');
let gameState;
/////////////////////////////////////////


socket.on('connect', () => console.log("User connected"));
socket.on('disconnect', () => console.log("User disconnected"));
socket.on('error', console.error);
socket.on('new game', (game) => {
  gameState = game.board;
  //Draw the board at start of game
  drawBoard(game.board);
  console.log("Test text", game.board);
});
socket.on('move made', (game) => {
  gameState = game.board;
  //Draw the board after a move has been made
  drawBoard(game.board);
});

let nextPlayer = 'X';

// let boardState = [
//   ['','',''],
//   ['','',''],
//   ['','','']
// ];

const drawBoard = (boardState) => {
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

  status.innerText = `It is ${nextPlayer}'s turn.`;
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
  drawBoard(gameState);

  console.log('You clicked on : ', row, col);
  console.log("Current game state", board);

  status.innerText = `It is ${nextPlayer}'s turn.`;
});
