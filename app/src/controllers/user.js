const RegisterErrors = require('../services/user/registerErrors')
const LoginErrors = require('../services/user/loginErrors')
const usersCollection = require('../db_access/user')
const passwordEncryption = require('../services/user/passwordEncryption')

exports.register = function(req, res) {
  const credentials = req.body
  const email = credentials.email
  const username = credentials.username
  const errorReport = new RegisterErrors()
  const findUserByEmail = usersCollection.findUserByEmail(email)
    .then((user) => { errorReport.reportExistingEmail(user) })
  const findUserByUsername = usersCollection.findUserByUsername(username)
    .then((user) => { errorReport.reportExistingUsername(user) })
  Promise.all([findUserByEmail, findUserByUsername])
    .then((results) => {
      if (errorReport.noError()) {
        insertNewUserIntoDB()
      } else {
        const errorMessage = errorReport.obtainErrorMessage()
        res.send({ errorMessage: errorMessage })
      }
    })
    .catch((dbError) => { sendErrorResponse(res).databaseError(dbError) })

  function insertNewUserIntoDB() {
    const password = credentials.password
    passwordEncryption.encrypt(password)
      .then((passwordHashed) => {
        usersCollection.insertNewUser(username, email, passwordHashed)
          .then((result) => { res.status(201).send({ success: "success" })})
          .catch((dbError) => { sendErrorResponse(res).databaseError(dbError) })
      })
      .catch((encryptError) => { sendErrorResponse(res).encryptError(encryptError) })
  }
}

function sendErrorResponse(response) {
  return {
    databaseError,
    encryptError
  }

  function databaseError(dbError) {
    console.log('Database error:')
    console.log(dbError)
    response.status(500).send({ errorMessage: 'Internal Server Error 1' })
  }

  function encryptError(encryptError) {
    console.log('Encryption error:')
    console.log(encryptError)
    response.status(500).send({ errorMessage: 'Internal Server Error 2' })
  }
}


exports.login = function(req, res) {
  res.status(200).send({ ok: "ok" })
  /*
  const credentials = req.body
  const username = credentials.username
  const password = credentials.password
  User.findOne({_id: username, password: password}, function(error, result) {
    if (result != null) {
      logInUser(res)
    } else if (result == null && error == null) {
      wrongCredential(res)
    } else {
      res.send(error)
    }
      console.log("error = " + error);
      console.log("result = " + result);
  })
  function logInUser(res) {
    res.status(200)
    /*
    // var session = ...
      session = req.session
      session.username = "TODO"
      session.email = "TODO.email"
    */
  }

  function wrongCredential(res) {
    res.status(404).send({
      description: 'wrong username or password'
    })
  }