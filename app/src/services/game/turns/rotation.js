const playersUtilities = require('../players/players')
const ifMarienbadGameResetSticks = require('../victory/ifMarienbadGameResetSticks')

const rotationTurns = {

  getActivePlayerForNewGame: function(players) {
    return players[0]
  },

  nextTurn: function(gameDocument) {
    const players = gameDocument.players
    const activePlayerIndex = players.indexOf(gameDocument.activePlayer)
    if (activePlayerIndex > -1) {
      if (activePlayerIndex === (players.length - 1)) {
        gameDocument.activePlayer = players[0]
      } else if (activePlayerIndex < (players.length - 1)) {
        gameDocument.activePlayer = players[activePlayerIndex + 1]
      }
    }
  },

  handleDisconnections: function(gameDocument) {
    if (gameDocument.disconnectedPlayers.includes(gameDocument.activePlayer)) {
      const disconnectedPlayer = gameDocument.activePlayer
      // console.log('found disconnected player: ' + disconnectedPlayer);
      ifMarienbadGameResetSticks(gameDocument)
      rotationTurns.nextTurn(gameDocument)
      playersUtilities.take(disconnectedPlayer).removeFromPlayersOf(gameDocument)
      playersUtilities.take(disconnectedPlayer).removeFromDisconnectedPlayersOf(gameDocument)
      playersUtilities.take(disconnectedPlayer).addToEliminatedPlayerOf(gameDocument)
      rotationTurns.handleDisconnections(gameDocument)
    }
  },
}

module.exports = rotationTurns
