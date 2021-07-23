const mongoose = require('mongoose')
const GameModel = require('./models/game')
const Game = GameModel(mongoose)

exports.insertNewInvitePlayerRoom = function(rows, standardVictory, turnRotation) {
  const newGame = new Game(
    {
      sticks: rows,
      standardVictory: standardVictory,
      turnRotation: turnRotation,
    }
  )
  return newGame.save()
}

// TODO diventa un update!!!
exports.insertNewGame = function(sticks, standardVictory, turnRotation, players, playersWithTurnDone) {
  const newGame = new Game(
    {
      sticks: sticks,
      standardVictory: standardVictory,
      turnRotation: turnRotation,
      players: players,
      playersWithTurnDone: playersWithTurnDone,
      eliminatedPlayer: []
    }
  )
  return newGame.save()
}

exports.deleteGameById = function(id) {
  return User.deleteOne({ _id: id })
}

exports.findGameById = function(id) {
  return Game.findById(id)//.lean()
}