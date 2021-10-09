const mongoose = require('mongoose')
const GameModel = require('./models/game')
const Game = GameModel(mongoose)

exports.insertNewGame = function(sticks, standardVictory, turnRotation) {
  const newGame = new Game(
    {
      sticks: sticks,
      standardVictory: standardVictory,
      turnRotation: turnRotation,
      activePlayer: null,
      players: null,
      playersWithTurnDone: null,
      eliminatedPlayers: null,
      disconnectedPlayers: null
    }
  )
  // newGame.createdAt
  return newGame.save()
}

exports.updateGameWithPlayers = function(id, activePlayer, players) {
  return Game.findByIdAndUpdate(id, 
    {
      activePlayer: activePlayer,
      players: players,
      playersWithTurnDone: [],
      eliminatedPlayers: [],
      disconnectedPlayers: []
    },
    { new: true } // 'new: true' returns the game document after the update is applied
  ).lean()
}

exports.deleteGameById = function(id) {
  return User.deleteOne({ _id: id }).lean()
}

exports.findGameById = function(id) {
  return Game.findById(id).lean()
}

exports.findGameDocumentById = function(id) {
  return Game.findById(id)
}