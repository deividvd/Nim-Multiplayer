/* This controller has the only responsibility of sending the application pages. */

exports.sendIndex = function(req, res) {
  res.sendFile(appRoot + '/www/index.html')
}
