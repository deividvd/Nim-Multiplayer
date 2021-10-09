const areAllSticksRemoved = require('./areAllSticksRemoved')
const turnManager = require('../turns/turnManager')
const playersUtilities = require('../players/players')

module.exports = function(gameDocument) {
  let win = false
  if (areAllSticksRemoved(gameDocument)) {
    // console.log('standard win!!!');
    win = true
    applyStandardWin(gameDocument)
  } else {
    turnManager.nextTurn(gameDocument)
    win = turnManager.handleDisconnectionWin(gameDocument)
  }
  return win

  function applyStandardWin(gameDocument) {
    movePlayersInEliminatedPlayers()
    movePlayersWithTurnDoneInEliminatedPlayers()
  
    function movePlayersInEliminatedPlayers() {
      const players = [...gameDocument.players]
      players.forEach((username) => {
        if (username !== gameDocument.activePlayer) {
          playersUtilities.take(username).removeFromPlayersOf(gameDocument)
          playersUtilities.take(username).addToEliminatedPlayerOf(gameDocument)
        }
      })
    }
  
    function movePlayersWithTurnDoneInEliminatedPlayers() {
      const playersWithTurnDone = [...gameDocument.playersWithTurnDone]
      playersWithTurnDone.forEach((username) => {
        playersUtilities.take(username).removeFromPlayersWithTurnDoneOf(gameDocument)
        playersUtilities.take(username).addToEliminatedPlayerOf(gameDocument)
      })
    }
  }
}
