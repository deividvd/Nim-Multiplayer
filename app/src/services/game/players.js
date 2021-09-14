exports.shuffle = function(players) {
  var currentIndex = players.length, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    [players[currentIndex], players[randomIndex]] = [players[randomIndex], players[currentIndex]]
  }
}

exports.removePlayer = function(username) {
  return {
    fromPlayersOf,
    fromDisconnectedPlayersOf
  }

  function fromPlayersOf(gameDocument) {
    let usernameIndex = gameDocument.players.indexOf(username)
    if (usernameIndex > -1) {
      gameDocument.players.splice(usernameIndex, 1)
      gameDocument.markModified('players')
    }
  }

  function fromDisconnectedPlayersOf(gameDocument) {
    let usernameIndex = gameDocument.disconnectedPlayers.indexOf(username)
    if (usernameIndex > -1) {
      gameDocument.disconnectedPlayers.splice(usernameIndex, 1)
      gameDocument.markModified('disconnectedPlayers')
    }
  }
}