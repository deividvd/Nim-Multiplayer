module.exports = function(gameDocument) {
  if (! gameDocument.standardVictory) {
    let row = 0
    const sticks = gameDocument.sticks
    for (let stickRow of sticks) {
      let position = 0
      for (let removedStick of stickRow) {
        if (removedStick) {
          if ( ! (gameDocument.activePlayer === removedStick ||
              gameDocument.eliminatedPlayers.includes(removedStick))) {
            gameDocument.sticks[row][position] = false
          }
        }
        position++
      }
      row++
    }
    gameDocument.markModified('sticks')
  }
}