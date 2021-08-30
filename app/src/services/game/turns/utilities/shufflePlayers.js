exports.shuffle = function(players) {
  var currentIndex = players.length, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    [players[currentIndex], players[randomIndex]] = [players[randomIndex], players[currentIndex]]
  }
}
