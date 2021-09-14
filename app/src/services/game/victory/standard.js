const areAllSticksRemoved = require('./utilities/areAllSticksRemoved')

exports.applySticksWin = function(gameDocument) {
  let win = false
  if (areAllSticksRemoved.areAllSticksRemoved(gameDocument)) {
    win = true
    movePlayersInEliminatedPlayers()
    movePlayersWithTurnDoneInEliminatedPlayers()
    gameDocument.markModified('players')
    gameDocument.markModified('playersWithTurnDone')
    gameDocument.markModified('eliminatedPlayers')

    function movePlayersInEliminatedPlayers() {
      const players = [...gameDocument.players]
      players.forEach((player) => {
        if (player !== gameDocument.activePlayer) {
          const playerIndex = gameDocument.players.indexOf(player)
          gameDocument.players.splice(playerIndex, 1)
          gameDocument.eliminatedPlayers.push(player)
        }
      })
    }

    function movePlayersWithTurnDoneInEliminatedPlayers() {
      const playersWithTurnDone = [...gameDocument.playersWithTurnDone]
      playersWithTurnDone.forEach((player) => {
        const playerIndex = gameDocument.playersWithTurnDone.indexOf(player)
        gameDocument.playersWithTurnDone.splice(playerIndex, 1)
        gameDocument.eliminatedPlayers.push(player)
      })
    }
  }
  return win
}
