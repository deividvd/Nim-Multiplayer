/* This controller has the responsibilities of managing everything that concerns
 * the user data: persistence data and session data. */

const ErrorSender = require('../services/ErrorSender')
const usersCollection = require('../db_access/user')
const passwordEncryption = require('../services/user/passwordEncryption')

/**
 * POST request with body: registration credentials.
 * 
 * A new user registers: his credentials are inserted in the database.
 */
exports.register = function(req, res) {
  const errorSender = new ErrorSender(res)
  const credentials = req.body
  const email = credentials.email
  const username = credentials.username
  const response = {
    emailExists: false,
    usernameExists: false,
  }
  promiseFindEmailAndUsernameInDB()
    .then((emailAndUsername) => {
      setResponseContentWith(emailAndUsername)
      if ( ! (response.emailExists || response.usernameExists)) {
        insertNewUserIntoDB()
      } else {
        res.send(response)
      }
    })
    .catch((dbError) => { errorSender.sendDatabaseError(dbError) })

  function promiseFindEmailAndUsernameInDB() {
    const findUserByEmail = usersCollection.findUserByEmail(email)
    const findUserByUsername = usersCollection.findUserByUsername(username)
    return Promise.all([findUserByEmail, findUserByUsername])
  }

  function setResponseContentWith(emailAndUsername) {
    if (emailAndUsername[0]) {
      response.emailExists = true
    }
    if (emailAndUsername[1]) {
      response.usernameExists = true
    }
  }

  function insertNewUserIntoDB() {
    const password = credentials.password
    passwordEncryption.encrypt(password)
      .then((hashedPassword) => {
        usersCollection.insertNewUser(username, email, hashedPassword)
          .then((insertedUser) => { res.status(201).send(response) })
          .catch((dbError) => { errorSender.sendDatabaseError(dbError) })
      })
      .catch((encryptError) => { errorSender.sendEncryptError(encryptError) })
  }
}

/**
 * POST request with body: login credentials.
 * 
 * A registered user logs in: his username is added to the session.
 */
exports.logIn = function(req, res) {
  const errorSender = new ErrorSender(res)
  const credentials = req.body
  const username = credentials.username
  const response = { login: true }
  usersCollection.findUserByUsername(username)
    .then((registeredUser) => {
      if (registeredUser) {
        comparePasswordInsertedWith(registeredUser.password)
          .then((passwordsMatch) => {
            if (passwordsMatch) {
              logIn()
            } else {
              sendWrongCredentialsResponse()
            }
          })
          .catch((decryptError) => { errorSender.sendDecryptError(decryptError) })
      } else {
        sendWrongCredentialsResponse()
      }
    })
    .catch((dbError) => { errorSender.sendDatabaseError(dbError) })

  function comparePasswordInsertedWith(encryptedPassword) {
    const password = credentials.password
    return passwordEncryption.compare(password, encryptedPassword)
  }

  function logIn() {
    req.session.username = username
    res.send(response)
  }

  function sendWrongCredentialsResponse() {
    response.login = false
    res.send(response)
  }
}

/**
 * GET request.
 * 
 * Sends the username that is logged in the session. 
 */
exports.getUserLoggedIn = function(req, res) {
  const usernameLoggedIn = req.session.username
  if (usernameLoggedIn) {
    res.send({ username: usernameLoggedIn })
  } else {
    res.send({ username: false })
  }
}

/**
 * POST request with body: empty.
 * 
 * Delete the username that is logged in the session. 
 */
exports.logOut = function(req, res) {
  const response = { logout: true }
  if (req.session.username) {
    logOut(req, res, response)
  } else {
    response.logout = false
    res.send(response)
  }
}

function logOut(req, res, response) {
  delete req.session.username
  res.send(response)
}

/**
 * POST request with body: empty.
 * 
 * Delete: the username that is logged in the session,
 * and his credentials saved in the database.
 */
exports.deleteAccount = function(req, res) {
  const errorSender = new ErrorSender(res)
  const usernameLoggedIn = req.session.username
  const response = { deleteAccount: true }
  if (usernameLoggedIn) {
    usersCollection.deleteUserByUsername(usernameLoggedIn)
      .then((deletion) => { // deletion = { n: 1, ok: 1, deletedCount: 1 }
        if (deletion.deletedCount === 1) {
          logOut(req, res, response)
        } else if (deletion.deletedCount === 0) {
          sendAccountNotFoundResponse()
        }
      })
      .catch((dbError) => { errorSender.sendDatabaseError(dbError) })
  } else {
    sendAccountNotFoundResponse()
  }

  function sendAccountNotFoundResponse() {
    response.deleteAccount = false
    res.send(response)
  }
}
