const rotationTurns = require('./rotation')
const chaosTurns = require('./chaos')
const onlyOnePlayerInGame = require('../victory/onlyOnePlayerInGame')

const turnManager = {

  getActivePlayerForNewGame: function(turnRotation, players) {
    let activePlayer
    if (turnRotation) {
      activePlayer = rotationTurns.getActivePlayerForNewGame(players)
    } else {
      activePlayer = chaosTurns.getRandomPlayerFrom(players)
    }
    return activePlayer
  },

  nextTurn: function(gameDocument) {
    if (gameDocument.turnRotation) {
      rotationTurns.nextTurn(gameDocument)
    } else {
      chaosTurns.nextTurn(gameDocument)
    }
  },

  handleDisconnectionWin: function(gameDocument) {
    if (gameDocument.turnRotation) {
      rotationTurns.handleDisconnections(gameDocument)
    } else {
      chaosTurns.handleDisconnections(gameDocument)
    }
    return onlyOnePlayerInGame(gameDocument)
  },

}

module.exports = turnManager