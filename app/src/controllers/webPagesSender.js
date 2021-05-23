exports.index = function(req, res) {
  res.sendFile(appRoot + '/www/index.html')
}

exports.gameRoom = function(req, res) {
  res.sendFile(appRoot + '/www/game-room.html')
}
