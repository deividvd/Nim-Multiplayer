initGlobalAppRoot()
initDBConnection()
var app = initExpressApp()
enableCors(app)
initRoutes(app)
startServer(app)

function initGlobalAppRoot() {
  var path = require('path')
  global.appRoot = path.resolve(__dirname)
}

function initDBConnection() {
  var mongoose = require('mongoose')
  mongoose.connect('mongodb://localhost/nimMultiplayer', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Connection Error: ' + err))
}

function initExpressApp() {
  var express = require('express')
  var app = express()
  app.use('/static', express.static(__dirname + '/public')) // serve static files in Express app
  app.use(express.json()) // parse the JSON body of http requests
  return app
}

function enableCors(app) { // enable CORS (e.g.: AJAX request)
  var cors = require('cors')
  app.use(cors())
}

function initRoutes(app) {
  var routes = require('./src/routes/routes')
  routes(app)
}

function startServer(app) {
  var PORT = 3000
  app.listen(PORT, function () {
    console.log('Node API server started on port ' + PORT)
  });
}
