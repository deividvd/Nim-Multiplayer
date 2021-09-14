exports.areAllSticksRemoved = function(game) {
  let allSticksRemoved = true
  for (let stickRow of game.sticks) {
    for (let removedStick of stickRow) {
      if ( ! removedStick) {
        allSticksRemoved = false
      }
    }
  }
  return allSticksRemoved
}