createDBConnection()
createGlobalAppRoot()
const app = newExpressApp()
const httpsServer = newHTTPSServer(app)
createSocketIO(httpsServer)
createRoutes(app)
startHTTPSServer(httpsServer)

function createDBConnection() {
  const mongoose = require('mongoose')
  mongoose.connect('mongodb://localhost/nim_multiplayer')
    .then(() => { console.log('\n MongoDB Connected') })
    .catch((error) => { console.log('\n MongoDB Connection Error: ' + error) })
}

function createGlobalAppRoot() {
  const path = require('path')
  global.appRoot = path.resolve(__dirname)
}

function newExpressApp() {
  const express = require('express')
  const app = express()
  serveFrontEndFiles()
  useJSONRequest()
  enableCORS()
  createExpressSession()
  return app

  function serveFrontEndFiles() {
    const frontEndFilePath = __dirname + '\\www\\public'
    app.use('/static', express.static(frontEndFilePath))
  }

  function useJSONRequest() { // e.g.: POST request's body in JSON
    app.use(express.json())
  }

  function enableCORS() { // e.g.: enable AJAX request
    const cors = require('cors')
    app.use(cors())
  }
  
  function createExpressSession() {
    const session = require('express-session')
    const nimMultiplayerSessionSettings = {
      /* best practice for secret:
         - the secret should be not easily parsed by a human;
         - store the secret in an system environment variable (it must not be hard-coded);
         - update periodically the secret, while ensuring the previous secret is in the array. */
      secret: [
        'secret_for_sign_cookie_session_id', 
        'this_secret_and_the_other_are_for_veryfing_the_signature_in_requests'
      ],
      name: 'NimMultiplayer',
      cookie: {
        // cookies are valid in the root path of the domain and in his sub-paths
        path: '/',
        // compliant clients will not allow Javascript to see the cookie in document.cookie
        httpOnly: true,
        // HTTPS is mandatory
        secure: true,
        // cookies validity: 1 hour
        maxAge: 60 * 60 * 1000
      },
      /* resave: force the session to be saved back to the session store,
         even if the session was never modified during the request.
         This parameter is set to false, it is not necessary, due to ... */
      resave: 'false',
      /* ... rolling: force the session identifier cookie to be set on every response.
         The expiration is reset to the original maxAge, resetting the expiration countdown.
         (rolling calls internally the method: 'req.session.touch()') */
      rolling: true,
      /* saveUninitialized: forces a session that is "uninitialized" to be saved to the session store.
         A session is "uninitialized" when it is new but not modified. 
         Choosing false is useful for implementing login sessions, reducing server session storage usage. */
      saveUninitialized: 'false',
    }
    app.use(session(nimMultiplayerSessionSettings))
  }
}

function newHTTPSServer(app) {
  const httpsCredentials = newCredentials()
  return newServer()
  
  function newCredentials() {
    const fs = require('fs')
    const privateKey = fs.readFileSync('https_stuff/server.key', 'utf8')
    const certificate = fs.readFileSync('https_stuff/server.cert', 'utf8')
    return {
      key: privateKey,
      cert: certificate
    }
  }

  function newServer() {
    const https = require('https')
    return https.createServer(httpsCredentials, app)
  }
}

function createSocketIO(httpsServer) {
  const io = require('socket.io')
  global.io = io(httpsServer)
}

function createRoutes(app) {
  const routes = require('./src/routes.js')
  routes(app)
}

function startHTTPSServer(httpsServer) {
  const port = 3000
  httpsServer.listen(port,
      function() {
        console.log('\n HTTPS Node Express server started on port ' + port)
        console.log("\n N.B.: the server will listen on:")
        console.log("\n https://localhost:/" + port)
        console.log("\n ... and the connection will be insecure! ( https certificate self-signed )")
      }
  )
}
