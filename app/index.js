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
    .then(() => { console.log('\n MongoDB Connected') })
    .catch((error) => { console.log('\n MongoDB Connection Error: ' + error) })
}

function createExpressApp() {
  const express = require('express')
  const app = express()
  serveFrontEndFiles()
  useJSONRequest()
  enableCORS()
  initExpressSession()
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
  
  function initExpressSession() {
    const session = require('express-session')
    const nimMultiplayerSession = {
      /* best practice for secret:
         - the secret should be not easily parsed by a human;
         - store the secret in an environment variable (it must not be hard-coded);
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
         even if the session was never modified during the request ...
         ... but this is not necessary because ... */
      resave: 'false',
      /* ... rolling: force the session identifier cookie to be set on every response.
         The expiration is reset to the original maxAge, resetting the expiration countdown.
         (rolling calls internally the method: 'req.session.touch()') */
      rolling: true,
      /* saveUninitialized: forces a session that is "uninitialized" to be saved to the session store.
         A session is uninitialized when it is new but not modified. 
         Choosing false is useful for implementing login sessions, reducing server session storage usage. */
      saveUninitialized: 'false',
    }
    app.use(session(nimMultiplayerSession))
  }

  function createRoutes() {
    const routes = require('./src/routes.js')
    routes(app)
  }
}

function startHTTPSServer() {
  const httpsCredentials = createHTTPSCredential()
  const httpsServer = createHTTPSServer()
  startServer()

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

  function startServer() {
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
