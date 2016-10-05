'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('game', {
  board: [
    [String, String, String],
    [String, String, String],
    [String, String, String]
  ],
  nextMove: String,
  result: String
});
