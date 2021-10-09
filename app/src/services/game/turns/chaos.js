const playersUtilities = require('../players/players')
const ifMarienbadGameResetSticks = require('../victory/ifMarienbadGameResetSticks')

const chaosTurns = {

  getRandomPlayerFrom: function(players) {
    const randomIndex = Math.floor(Math.random() * players.length)
    return players[randomIndex]
  },

  nextTurn: function(gameDocument) {
    playersUtilities.take(gameDocument.activePlayer).removeFromPlayersOf(gameDocument)
    playersUtilities.take(gameDocument.activePlayer).addToPlayersWithTurnDoneOf(gameDocument)
    if (gameDocument.players.length === 0) {
      gameDocument.players = [...gameDocument.playersWithTurnDone]
      gameDocument.playersWithTurnDone = []
    }
    if (gameDocument.players.length > 0) {
      gameDocument.activePlayer = chaosTurns.getRandomPlayerFrom(gameDocument.players)
    }
  },

  handleDisconnections: function(gameDocument) {
    if (gameDocument.disconnectedPlayers.includes(gameDocument.activePlayer)) {
      const disconnectedPlayer = gameDocument.activePlayer
      // console.log('found disconnected player: ' + disconnectedPlayer);
      ifMarienbadGameResetSticks(gameDocument)
      chaosTurns.nextTurn(gameDocument)
      playersUtilities.take(disconnectedPlayer).removeFromPlayersOf(gameDocument)
      playersUtilities.take(disconnectedPlayer).removeFromPlayersWithTurnDoneOf(gameDocument)
      playersUtilities.take(disconnectedPlayer).removeFromDisconnectedPlayersOf(gameDocument)
      playersUtilities.take(disconnectedPlayer).addToEliminatedPlayerOf(gameDocument)
      if (gameDocument.activePlayer === disconnectedPlayer) { // all players have taken turns, and the disconnected player has been selected
        chaosTurns.nextTurn(gameDocument)
        playersUtilities.take(disconnectedPlayer).removeFromPlayersOf(gameDocument)
        playersUtilities.take(disconnectedPlayer).removeFromPlayersWithTurnDoneOf(gameDocument)
      }
      chaosTurns.handleDisconnections(gameDocument)
    }
  },
}

module.exports = chaosTurns
