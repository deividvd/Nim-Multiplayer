exports.index = function(req, res) {
	res.sendFile(appRoot  + '/www/index.html')
}

exports.show_404 = function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
}

exports.gameRoom = function(req, res) {
	res.sendFile(appRoot  + '/www/gameRoom.html')
}
