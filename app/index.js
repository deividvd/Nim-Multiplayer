createGlobalAppRoot()
createDBConnection()
const app = createExpressApp()
startServer(app)

function createGlobalAppRoot() {
  const path = require('path')
  global.appRoot = path.resolve(__dirname)
}

function createDBConnection() {
  const mongoose = require('mongoose')
  mongoose.connect('mongodb://localhost/nimMultiplayer',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Connection Error: ' + err))
}

function createExpressApp() {
  const express = require('express')
  const app = express()
  serveFrontEndFiles(app, express)
  useJSONRequest(app, express)
  enableCORS(app)
  createRoutes(app)
  return app

  function serveFrontEndFiles(app, express) {
    app.use('/static', express.static(__dirname + '/public'))
  }

  function useJSONRequest(app, express) { // e.g.: POST request's body in JSON
    app.use(express.json())
  }

  function enableCORS(app) { // e.g.: enable AJAX request
    const cors = require('cors')
    app.use(cors())
  }

  function createRoutes(app) {
    const routes = require('./src/routes.js')
    routes(app)
  }
}

function startServer(app) {
  const PORT = 3000
  app.listen(PORT, function () {
    console.log('Node API server started on port ' + PORT)
  });
}

// TODO: ????

function initExpressSession(app) {
  var session = require('express-session')
  var login_session = {
    secret: ['secret_for_sign_cookie_session_id', 'this_secret_and_the_other_are_for_veryfing_signature_in_requests'],
    name: 'secret_name',
    cookie: {
      path: '/', // root path of the domain
      httpOnly: true, // blocks the use of the "document.cookie" object
      secure: false, // if true, an HTTPS connection is needed
      maxAge: 60000 // = 1 minute, TODO: test it, then 15-30 minutes ???
    },
    resave: 'false', // login sessions don't need to be saved!!!
    saveUninitialized: 'false' // "uninitialized" means "new but not modified": new login sessions don't need to be saved !!!
  }
  app.use(session(login_session))
}
