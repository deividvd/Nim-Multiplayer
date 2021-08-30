exports.setActivePlayerForNewGame = function(activePlayerObj, players) {
  activePlayerObj.player = getRandomPlayerFrom(players)
}

exports.nextTurn = function(game) {
  const activePlayer = game.activePlayer
  game.playersWithTurnDone.push(activePlayer)
  const activePlayerIndex = game.players.indexOf(activePlayer)
  game.players.splice(activePlayerIndex, 1)
  if (game.players.length === 0) {
    game.players = [...game.playersWithTurnDone]
    game.playersWithTurnDone = []
  }
  game.activePlayer = getRandomPlayerFrom(game.players)
}

function getRandomPlayerFrom(players) {
  const randomIndex = Math.floor(Math.random() * players.length)
  return players[randomIndex]
}