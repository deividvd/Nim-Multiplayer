const mongoose = require('mongoose')
const GameModel = require('./models/game')
const Game = GameModel(mongoose)

exports.insertNewGame = function(sticks, standardVictory, turnRotation) {
  const newGame = new Game(
    {
      sticks: sticks,
      standardVictory: standardVictory,
      turnRotation: turnRotation,
      players: null,
      playersWithTurnDone: null,
      activePlayer: null,
      eliminatedPlayer: null,
    }
  )
  return newGame.save()
}

exports.updateGameWithPlayers = function(id, players, playersWithTurnDone, activePlayer) {
  return Game.findByIdAndUpdate(id, 
    {
      players: players,
      playersWithTurnDone: playersWithTurnDone,
      activePlayer: activePlayer,
      eliminatedPlayer: [],
    }
  ).lean()
}

exports.deleteGameById = function(id) {
  return User.deleteOne({ _id: id }).lean()
}

exports.findGameById = function(id) {
  return Game.findById(id).lean()
}