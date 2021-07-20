const ResponseSender = require('../services/ResponseSender')
const usersCollection = require('../db_access/user')
const RegistrationExceptions = require('../services/user/RegistrationExceptions')
const passwordEncryption = require('../services/user/passwordEncryption')
const objectUtilitiesOf = require('../utilities/object')
const stringUtilitiesOf = require('../utilities/string')

exports.register = function(req, res) {
  const responseSender = new ResponseSender(res)
  const credentials = req.body
  const email = credentials.email
  const username = credentials.username
  findEmailAndUsernameInDB()
    .then((results) => {
      const exceptionMessage = obtainExceptionMessageFrom(results[0], results[1])
      if (exceptionMessage === '') {
        insertNewUserIntoDB()
      } else {
        responseSender.sendExceptionMessage(exceptionMessage)
      }
    })
    .catch((dbError) => { responseSender.sendDatabaseError(dbError) })

  function findEmailAndUsernameInDB() {
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
          .then((userInserted) => { responseSender.sendSuccess(201) })
          .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
      })
      .catch((encryptError) => { responseSender.sendEncryptError(encryptError) })
  }
}

exports.logIn = function(req, res) {
  const responseSender = new ResponseSender(res)
  const credentials = req.body
  const username = credentials.username
  usersCollection.findUserByUsername(username)
    .then((user) => {
      if (objectUtilitiesOf(user).isObjectType()) {
        comparePasswordInsertedWith(user)
          .then((passwordsMatch) => {
            if (passwordsMatch) {
              logIn()
            } else {
              sendWrongCredentialsResponse()
            }
          })
          .catch((decryptError) => { responseSender.sendDecryptError(decryptError) })
      } else {
        sendWrongCredentialsResponse()
      }
    })
    .catch((dbError) => { responseSender.sendDatabaseError(dbError) })

  function comparePasswordInsertedWith(registeredUser) {
    const password = credentials.password
    const encryptedPassword = registeredUser.password
    return passwordEncryption.compare(password, encryptedPassword)
  }

  function logIn() {
    req.session.username = username
    responseSender.sendSuccess(200)
  }

  function sendWrongCredentialsResponse() {
    responseSender.sendExceptionMessage('Incorrect username or password.')
  }
}

exports.getUserLoggedIn = function(req, res) {
  const usernameLoggedIn = req.session.username
  if (stringUtilitiesOf(usernameLoggedIn).isStringType()) {
    res.send({ username: usernameLoggedIn })
  } else {
    res.send({ username: null })
  }
}

exports.logOut = function(req, res) {
  if (req.session.username) {
    logOut(req, res)
  } else {
    const responseSender = new ResponseSender(res)
    responseSender.sendExceptionMessage('You are not logged in. Please reload this page.')
  }
}

function logOut(req, res) {
  delete req.session.username
  const responseSender = new ResponseSender(res)
  responseSender.sendSuccess(200)
}

exports.deleteAccount = function(req, res) {
  const responseSender = new ResponseSender(res)
  const usernameLoggedIn = req.session.username
  if (stringUtilitiesOf(usernameLoggedIn).isStringType()) {
    usersCollection.deleteUserByUsername(usernameLoggedIn)
      .then((deletion) => { // deletion = { n: 1, ok: 1, deletedCount: 1 }
        if (deletion.deletedCount === 1) {
          logOut(req, res)
        } else if (deletion.deletedCount === 0) {
          sendAccountNotFoundResponse()
        } else { // this code should never be reached !!!
          const errorMessage = 'The username "' + usernameLoggedIn
            + '" account deletion operation has produced the result: ' + deletion
          responseSender.sendDatabaseError(errorMessage)
        }
      })
      .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
  } else {
    sendAccountNotFoundResponse()
  }

  function sendAccountNotFoundResponse() {
    responseSender.sendExceptionMessage('Account not found. Please log out or clear your cookies, then try again.')
  }
}
