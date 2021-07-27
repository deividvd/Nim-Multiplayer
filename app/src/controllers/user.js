const ErrorSender = require('../services/ErrorSender')
const usersCollection = require('../db_access/user')
const RegistrationExceptions = require('../services/user/RegistrationExceptions')
const passwordEncryption = require('../services/user/passwordEncryption')
const objectUtilitiesOf = require('../utilities/object')

exports.register = function(req, res) {
  const errorSender = new ErrorSender(res)
  const credentials = req.body
  const email = credentials.email
  const username = credentials.username
  promiseFindEmailAndUsernameInDB()
    .then((results) => {
      const exceptionMessage = obtainExceptionMessageFrom(results[0], results[1])
      if (exceptionMessage === '') {
        insertNewUserIntoDB()
      } else {
        errorSender.sendExceptionMessage(exceptionMessage)
      }
    })
    .catch((dbError) => { errorSender.sendDatabaseError(dbError) })

  function promiseFindEmailAndUsernameInDB() {
    const findUserByEmail = usersCollection.findUserByEmail(email)
    const findUserByUsername = usersCollection.findUserByUsername(username)
    return Promise.all([findUserByEmail, findUserByUsername])
  }

  function obtainExceptionMessageFrom(userHavingTheEmailInserted, userHavingTheUsernameInserted) {
    const registrationExceptions = new RegistrationExceptions()
    registrationExceptions.addExistingEmailIfExist(userHavingTheEmailInserted)
    registrationExceptions.addExistingUsernameIfExist(userHavingTheUsernameInserted)
    return registrationExceptions.obtainExceptionMessage()
  }

  function insertNewUserIntoDB() {
    const password = credentials.password
    passwordEncryption.encrypt(password)
      .then((hashedPassword) => {
        usersCollection.insertNewUser(username, email, hashedPassword)
          .then((insertedUser) => { res.sendStatus(201) /* equivalent to res.status(201).send('OK') */ })
          .catch((dbError) => { errorSender.sendDatabaseError(dbError) })
      })
      .catch((encryptError) => { errorSender.sendEncryptError(encryptError) })
  }
}

exports.logIn = function(req, res) {
  const errorSender = new ErrorSender(res)
  const credentials = req.body
  const username = credentials.username
  usersCollection.findUserByUsername(username)
    .then((registeredUser) => {
      if (objectUtilitiesOf(registeredUser).isObjectType()) {
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
    res.sendStatus(200) /* equivalent to res.status(200).send('OK') */
  }

  function sendWrongCredentialsResponse() {
    errorSender.sendExceptionMessage('Incorrect username or password.')
  }
}

exports.getUserLoggedIn = function(req, res) {
  const usernameLoggedIn = req.session.username
  if (usernameLoggedIn) {
    res.send({ username: usernameLoggedIn })
  } else {
    res.send({ username: null })
  }
}

exports.logOut = function(req, res) {
  if (req.session.username) {
    logOut(req, res)
  } else {
    const errorSender = new ErrorSender(res)
    errorSender.sendExceptionMessage('You are not logged in. Please reload this page.')
  }
}

function logOut(req, res) {
  delete req.session.username
  res.sendStatus(200) /* equivalent to res.status(200).send('OK') */
}

exports.deleteAccount = function(req, res) {
  const errorSender = new ErrorSender(res)
  const usernameLoggedIn = req.session.username
  if (usernameLoggedIn) {
    usersCollection.deleteUserByUsername(usernameLoggedIn)
      .then((deletion) => { // deletion = { n: 1, ok: 1, deletedCount: 1 }
        if (deletion.deletedCount === 1) {
          logOut(req, res)
        } else if (deletion.deletedCount === 0) {
          sendAccountNotFoundResponse()
        } else { // this code should never be reached !!!
          const errorMessage = 'The username "' + usernameLoggedIn
            + '" account deletion operation has produced the result: ' + deletion
          errorSender.sendDatabaseError(errorMessage)
        }
      })
      .catch((dbError) => { errorSender.sendDatabaseError(dbError) })
  } else {
    sendAccountNotFoundResponse()
  }

  function sendAccountNotFoundResponse() {
    errorSender.sendExceptionMessage('Account not found. Please log out or clear your cookies, then try again.')
  }
}
