'use strict';

const express = require('express');
const mongoose = require('mongoose');
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

    console.log("User connected to server", socket.id)

    socket.on('disconnect', () => {
      console.log("User disconnected from server", socket.id);
    })

  });
});
