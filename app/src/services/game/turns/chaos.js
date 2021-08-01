exports.prepareGame = function(players, activePlayer) {
  setRandomActivePlayer(players, activePlayer)
}

exports.nextTurn = function(players, playersWithTurnDone, activePlayer) {
  playersWithTurnDone.push(activePlayer)
  const activePlayerIndex = players.indexOf(activePlayer)
  players.splice(activePlayerIndex, 1)
  if (players.length === 0) {
    players = [...playersWithTurnDone]
    playersWithTurnDone = []
    setRandomActivePlayer(players, activePlayer)
  } else {
    setRandomActivePlayer(players, activePlayer)
  }
}

function setRandomActivePlayer(players, activePlayer) {
  const randomIndex = Math.floor(Math.random() * players.length)
  activePlayer.player = players[randomIndex]
}