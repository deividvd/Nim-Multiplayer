exports.getActivePlayerForNewGame = function(players) {
  return getRandomPlayerFrom(players)
}

exports.nextTurn = function(gameDocument) {
  const activePlayer = gameDocument.activePlayer
  const activePlayerIndex = gameDocument.players.indexOf(activePlayer)
  if (activePlayerIndex > -1) {
    gameDocument.players.splice(activePlayerIndex, 1)
    gameDocument.playersWithTurnDone.push(activePlayer)
  }
  if (gameDocument.players.length === 0) {
    gameDocument.players = [...gameDocument.playersWithTurnDone]
    gameDocument.playersWithTurnDone = []
  }
  if (gameDocument.players.length > 0) {
    gameDocument.activePlayer = getRandomPlayerFrom(gameDocument.players)
  }
  gameDocument.markModified('players')
  gameDocument.markModified('playersWithTurnDone')
}

function getRandomPlayerFrom(players) {
  const randomIndex = Math.floor(Math.random() * players.length)
  return players[randomIndex]
}