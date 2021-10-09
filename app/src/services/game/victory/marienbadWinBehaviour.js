const areAllSticksRemoved = require('./areAllSticksRemoved')
const turnManager = require('../turns/turnManager')
const playersUtilities = require('../players/players')
const ifMarienbadGameResetSticks = require('./ifMarienbadGameResetSticks')
const onlyOnePlayerInGame = require('./onlyOnePlayerInGame')

module.exports = function(gameDocument) {
  let win = false
  if (areAllSticksRemoved(gameDocument)) {
    // console.log('active player loses!!!');
    ifMarienbadGameResetSticks(gameDocument)
    applyMarienbadLoseAndNextTurn(gameDocument)
    win = onlyOnePlayerInGame(gameDocument)
    // console.log('only one player in game win = ' + win);
    // console.log('Marienbad win!!!');
  } else {
    turnManager.nextTurn(gameDocument)
    win = turnManager.handleDisconnectionWin(gameDocument)
  }
  return win

  function applyMarienbadLoseAndNextTurn(gameDocument) {
    const losingPlayer = gameDocument.activePlayer
    turnManager.nextTurn(gameDocument)
    playersUtilities.take(losingPlayer).removeFromPlayersOf(gameDocument)
    playersUtilities.take(losingPlayer).addToEliminatedPlayerOf(gameDocument)
    if ( ! gameDocument.turnRotation) {
      playersUtilities.take(losingPlayer).removeFromPlayersWithTurnDoneOf(gameDocument)
      if (gameDocument.activePlayer === losingPlayer) {
        turnManager.nextTurn(gameDocument)
        playersUtilities.take(losingPlayer).removeFromPlayersWithTurnDoneOf(gameDocument)
      }
    }
    turnManager.handleDisconnectionWin(gameDocument)
  }
}
