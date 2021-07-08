const usersCollection = require('../db_access/user')
const RegisterErrors = require('../services/user/registerErrors')
const passwordEncryption = require('../services/user/passwordEncryption')
const responseSender = require('../services/responseSender')
const objectUtilitiesOf = require('../utilities/object')
const stringUtilitiesOf = require('../utilities/string')

exports.register = function(req, res) {
  const credentials = req.body
  const email = credentials.email
  const username = credentials.username
  findEmailAndUsernameInDB()
    .then((results) => {
      const exceptionMessage = obtainExceptionMessageFrom(results[0], results[1])
      if (exceptionMessage === '') {
        insertNewUserIntoDB()
      } else {
        responseSender.exception(res).sendMessage(exceptionMessage)
      }
    })
    .catch((dbError) => { responseSender.error(res).sendDatabaseError(dbError) })

  function findEmailAndUsernameInDB() {
    const findUserByEmail = usersCollection.findUserByEmail(email)
    const findUserByUsername = usersCollection.findUserByUsername(username)
    return Promise.all([findUserByEmail, findUserByUsername])
  }

  function obtainExceptionMessageFrom(userHavingTheEmailInserted, userHavingTheUsernameInserted) {
    const errorReport = new RegisterErrors()
    errorReport.reportExistingEmailIfExist(userHavingTheEmailInserted)
    errorReport.reportExistingUsernameIfExist(userHavingTheUsernameInserted)
    return errorReport.obtainErrorMessage()
  }

  function insertNewUserIntoDB() {
    const password = credentials.password
    passwordEncryption.encrypt(password)
      .then((hashedPassword) => {
        usersCollection.insertNewUser(username, email, hashedPassword)
          .then((userInserted) => { responseSender.success(res).sendStatus(201) })
          .catch((dbError) => { responseSender.error(res).sendDatabaseError(dbError) })
      })
      .catch((encryptError) => { responseSender.error(res).sendEncryptError(encryptError) })
  }
}

exports.logIn = function(req, res) {
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
              sendWrongCredentialResponse()
            }
          })
          .catch((decryptError) => { responseSender.error(res).sendDecryptError(decryptError) })
      } else {
        sendWrongCredentialResponse()
      }
    })
    .catch((dbError) => { responseSender.error(res).sendDatabaseError(dbError) })

  function comparePasswordInsertedWith(registeredUser) {
    const password = credentials.password
    const encryptedPassword = registeredUser.password
    return passwordEncryption.compare(password, encryptedPassword)
  }

  function logIn() {
    req.session.username = username
    responseSender.success(res).sendStatus(200)
  }

  function sendWrongCredentialResponse() {
    responseSender.exception(res).sendMessage('Incorrect username or password.')
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
    responseSender.exception(res).sendMessage('User is not logged in.')
  }
}

function logOut(req, res) {
  delete req.session.username
  responseSender.success(res).sendStatus(200)
}

exports.deleteAccount = function(req, res) {
  const usernameLoggedIn = req.session.username
  if (stringUtilitiesOf(usernameLoggedIn).isStringType()) {
    usersCollection.deleteUserByUsername(usernameLoggedIn)
      .then((deletion) => { // deletion = { n: 1, ok: 1, deletedCount: 1 }
        console.log(deletion);
        if (deletion.deletedCount === 1) {
          logOut(req, res)
        } else {
          responseSender.exception(res).sendMessage('Account not found. Please log out or clear your cookies, then try again.')
        }
      })
      .catch((dbError) => { responseSender.error(res).sendDatabaseError(dbError) })
  } else {
    responseSender.error(res).sendMalformedRequestError()
  }
}
