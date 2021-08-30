exports.setActivePlayerForNewGame = function(activePlayerObj, players) {
  activePlayerObj.player = players[0]
}

exports.nextTurn = function(game) {
  const players = game.players
  const activePlayerIndex = players.indexOf(game.activePlayer)
  if (activePlayerIndex === (players.length - 1)) {
    game.activePlayer = players[0]
  } else {
    game.activePlayer = players[activePlayerIndex + 1]
  }
}