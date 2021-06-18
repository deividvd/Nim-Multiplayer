const usersCollection = require('../db_access/user')
const RegisterErrors = require('../services/user/registerErrors')
const passwordEncryption = require('../services/user/passwordEncryption')

exports.register = function(req, res) {
  const credentials = req.body
  const email = credentials.email
  const username = credentials.username
  findEmailAndUsername()
    .then((results) => {
      const errorMessage = obtainErrorMessageFrom(results[0], results[1])
      if (errorMessage === '') {
        insertNewUserIntoDB()
      } else {
        res.send({ errorMessage: errorMessage })
      }
    })
    .catch((dbError) => { sendErrorIn(res).databaseError(dbError) })

  function findEmailAndUsername() {
    const findUserByEmail = usersCollection.findUserByEmail(email)
    const findUserByUsername = usersCollection.findUserByUsername(username)
    return Promise.all([findUserByEmail, findUserByUsername])
  }

  function obtainErrorMessageFrom(userHavingTheEmailInserted, userHavingTheUsernameInserted) {
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
          .then((userInserted) => { res.status(201).send(newSuccess()) })
          .catch((dbError) => { sendErrorIn(res).databaseError(dbError) })
      })
      .catch((encryptError) => { sendErrorIn(res).encryptError(encryptError) })
  }
}

function sendErrorIn(res) {
  return {
    databaseError,
    encryptError,
    decryptError
  }

  function databaseError(dbError) {
    console.log('Database error:')
    console.log(dbError)
    res.status(500).send({ errorMessage: 'Internal Server Error 1' })
  }

  function encryptError(encryptError) {
    console.log('Encryption error:')
    console.log(encryptError)
    res.status(500).send({ errorMessage: 'Internal Server Error 2' })
  }

  function decryptError(decryptError) {
    console.log('Decryption error:')
    console.log(decryptError)
    res.status(500).send({ errorMessage: 'Internal Server Error 3' })
  }
}

function newSuccess() {
  return { success: 'success' }
}

exports.login = function(req, res) {
  const credentials = req.body
  const username = credentials.username
  usersCollection.findUserByUsername(username)
    .then((user) => {
      if (user) {
        verifyPasswordInsertedWith(user)
          .then((match) => {
            if (match) {
              login()
            } else {
              sendWrongCredentialResponse()
            }
          })
          .catch((decryptError) => { sendErrorIn(res).decryptError(decryptError) })
      } else {
        sendWrongCredentialResponse()
      }
    })
    .catch((dbError) => { sendErrorIn(res).databaseError(dbError) })

  function verifyPasswordInsertedWith(registeredUser) {
    const password = credentials.password
    const encryptedPassword = registeredUser.password
    return passwordEncryption.compare(password, encryptedPassword)
  }

  function login() {
    req.session.username = username
    res.send(newSuccess())
  }

  function sendWrongCredentialResponse() {
    res.send({ errorMessage: 'Incorrect username or password.' })
  }
}

exports.getUserLoggedIn = function(req, res) {
  if (req.session.username) {
    res.send({ username: req.session.username })
  } else {
    res.send({ username: null })
  }
}

exports.logout = function(req, res) {
  if (req.session.username) {
    delete req.session.username
    res.send(newSuccess())
  }
}

exports.deleteAccount = function(req, res) {

}