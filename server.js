'use strict';

const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Server } = require('http');
const socketio = require('socket.io');
const app = express();
const server = Server(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;
/////////////////////////////////////////

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/tictactoe';

app.use(express.static('client'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'));

const Game = mongoose.model('game', {
  board: [
    [String, String, String],
    [String, String, String],
    [String, String, String]
  ]
});

mongoose.connect(MONGODB_URL, () => {
  server.listen(PORT, () => console.log("Listening on port number ", PORT));

  io.on('connection', (socket) => {
    console.log("User connected to server", socket.id);
    //On every connection create a new game board
    Game.create({
      board: [ ['','',''], ['','',''], ['','',''] ]
    })
    .then((game) => {
      socket.game = game;
      socket.emit('new game', game);
    })
    .catch((err) => {
      socket.emit('error', err);
      console.error(err);
    });

    socket.on('make move', ({row, col}) => {
      socket.game.board[row][col] = 'X';
      socket.game.markModified('board');
      socket.game.save()
      .then((game) => socket.emit('move made', game));
    });


    socket.on('disconnect', () => {
      console.log("User disconnected from server", socket.id);
    })

  });
});
