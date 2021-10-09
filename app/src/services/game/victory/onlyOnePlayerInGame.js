module.exports = function(game) {
  return (
    (game.players.length === 1 || game.players.length === 0) &&
    game.playersWithTurnDone.length === 0 &&
    game.disconnectedPlayers.length === 0
  )
}