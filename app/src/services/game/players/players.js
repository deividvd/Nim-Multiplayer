exports.shuffle = function(players) {
  var currentIndex = players.length, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    [players[currentIndex], players[randomIndex]] = [players[randomIndex], players[currentIndex]]
  }
}

exports.take = function(username) {
  return {
    removeFromPlayersOf,
    removeFromPlayersWithTurnDoneOf,
    removeFromDisconnectedPlayersOf,
    addToPlayersWithTurnDoneOf,
    addToDisconnectedPlayersOf,
    addToEliminatedPlayerOf,
  }

  function removeFromPlayersOf(gameDocument) {
    const usernameIndex = gameDocument.players.indexOf(username)
    if (usernameIndex > -1) {
      gameDocument.players.splice(usernameIndex, 1)
      gameDocument.markModified('players')
    }
  }

  function removeFromPlayersWithTurnDoneOf(gameDocument) {
    const usernameIndex = gameDocument.playersWithTurnDone.indexOf(username)
    if (usernameIndex > -1) {
      gameDocument.playersWithTurnDone.splice(usernameIndex, 1)
      gameDocument.markModified('playersWithTurnDone')
    }
  }

  function removeFromDisconnectedPlayersOf(gameDocument) {
    const usernameIndex = gameDocument.disconnectedPlayers.indexOf(username)
    if (usernameIndex > -1) {
      gameDocument.disconnectedPlayers.splice(usernameIndex, 1)
      gameDocument.markModified('disconnectedPlayers')
    }
  }

  function addToPlayersWithTurnDoneOf(gameDocument) {
    gameDocument.playersWithTurnDone.push(username)
    gameDocument.markModified('playersWithTurnDone')
  }

  function addToDisconnectedPlayersOf(gameDocument) {
    gameDocument.disconnectedPlayers.push(username)
    gameDocument.markModified('disconnectedPlayers')
  }

  function addToEliminatedPlayerOf(gameDocument) {
    gameDocument.eliminatedPlayers.push(username)
    gameDocument.markModified('eliminatedPlayers')
  }
}
