exports.sendIndex = function(req, res) {
  res.sendFile(appRoot + '/www/index.html')
}
