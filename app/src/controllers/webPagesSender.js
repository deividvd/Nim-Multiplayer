exports.index = function(req, res) {
  res.sendFile(appRoot + '/www/index.html')
}

exports.gameRoom = function(req, res) {
  res.sendFile(appRoot + '/www/gameRoom.html')
  // req.params.id ---- gameRoomId
}
