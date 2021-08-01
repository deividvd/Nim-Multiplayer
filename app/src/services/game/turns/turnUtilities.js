/* Shuffling players is a function about turn utilities,
 * because the order of the players in the array, determines their turn order.
 */

exports.shufflePlayers = function(player) {
  var currentIndex = player.length, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    [player[currentIndex], player[randomIndex]] = [player[randomIndex], player[currentIndex]]
  }
}
