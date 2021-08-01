exports.prepareGame = function(players, activePlayer) {
  activePlayer.player = players[0]
}

exports.nextTurn = function(players, activePlayer) {
  const activePlayerIndex = players.indexOf(activePlayer)
  if (activePlayerIndex === (players.length - 1)) {
    activePlayer = players[0]
  } else {
    activePlayer = players[activePlayerIndex + 1]
  }
}