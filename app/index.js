createGlobalAppRoot()
createDBConnection()
const app = createExpressApp()
startHTTPSServer()


function createGlobalAppRoot() {
  const path = require('path')
  global.appRoot = path.resolve(__dirname)
}

function createDBConnection() {
  const mongoose = require('mongoose')
  const mongooseSettings = { 
    useNewUrlParser: true, 
    useFindAndModify: false, 
    useUnifiedTopology: true
  }
  mongoose.connect('mongodb://localhost/nim_multiplayer', mongooseSettings)
    .then(() => {
      console.log('\n MongoDB Connected')
    })
    .catch((error) => {
      console.log('\n MongoDB Connection Error: ' + error)
    })
}

function createExpressApp() {
  const express = require('express')
  const app = express()
  serveFrontEndFiles()
  useJSONRequest()
  enableCORS()
  createRoutes()
  return app

  function serveFrontEndFiles() {
    app.use('/static', express.static(__dirname + '/public'))
  }

  function useJSONRequest() { // e.g.: POST request's body in JSON
    app.use(express.json())
  }

  function enableCORS() { // e.g.: enable AJAX request
    const cors = require('cors')
    app.use(cors())
  }

  function createRoutes() {
    const routes = require('./src/routes.js')
    routes(app)
  }
}

function startHTTPSServer() {
  const httpsCredentials = createHTTPSCredential()
  const httpsServer = createHTTPSServer()
  startServer(httpsServer)

  function createHTTPSCredential() {
    const fs = require('fs')
    const privateKey = fs.readFileSync('https_stuff/server.key', 'utf8')
    const certificate = fs.readFileSync('https_stuff/server.cert', 'utf8')
    return {
      key: privateKey,
      cert: certificate
    }
  }

  function createHTTPSServer() {
    const https = require('https')
    return https.createServer(httpsCredentials, app)
  }

  function startServer(httpsServer) {
    const port = 3000
    httpsServer.listen(port, 
        function() {
          console.log('\n HTTPS Node Express server started on port ' + port)
          console.log("\n N.B.: the server will listen on:")
          console.log("\n https://localhost:/" + port)
          console.log("\n ... and the connection will be insecure! ( https certificate self-signed )")
          console.log("")
        }
    )
  }
}

// TODO: ????

function initExpressSession() {
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
