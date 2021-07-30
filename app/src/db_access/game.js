const mongoose = require('mongoose')
const GameModel = require('./models/game')
const Game = GameModel(mongoose)

exports.insertNewGame = function(sticks, standardVictory, turnRotation) {
  const newGame = new Game(
    {
      sticks: sticks,
      standardVictory: standardVictory,
      turnRotation: turnRotation,
    }
  )
  return newGame.save()
}

exports.updateGameWithPlayers = function(id, players, playersWithTurnDone) {
  return Game.findByIdAndUpdate(id, 
    {
      players: players,
      playersWithTurnDone: playersWithTurnDone,
    }
  ).lean()
}

exports.deleteGameById = function(id) {
  return User.deleteOne({ _id: id }).lean()
}

exports.findGameById = function(id) {
  return Game.findById(id).lean()
}