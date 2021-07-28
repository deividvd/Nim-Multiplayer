const mongoose = require('mongoose')
const GameModel = require('./models/game')
const Game = GameModel(mongoose)

exports.insertNewInvitePlayerRoom = function(rows, standardVictory, turnRotation) {
  const newGame = new Game(
    {
      sticks: rows,
      standardVictory: standardVictory,
      turnRotation: turnRotation,
      playersWithTurnDone: [],
    }
  )
  return newGame.save()
}

exports.updateInvitePlayerRoomToGameRoom = function(id, sticks, players) {
  return Game.findByIdAndUpdate(id, 
    {
      sticks: sticks,
      players: players
    }
  ).lean()
}

exports.deleteGameById = function(id) {
  return User.deleteOne({ _id: id }).lean()
}

exports.findGameById = function(id) {
  return Game.findById(id).lean()
}