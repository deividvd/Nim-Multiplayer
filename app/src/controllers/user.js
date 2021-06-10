const usersCollection = require('../db_access/user')
const passwordEncryption = require('../services/user/passwordEncryption')
const registerErrors = require('../services/user/registerErrors')

exports.register = function(req, res) {
  const credentials = req.body
  const email = credentials.email
  const username = credentials.username
  const errors = registerErrors
  const findUserByEmail = usersCollection.findUserByEmail(email)
    .then(errors.reportExistingEmail)
    .catch(errors.getLibraryErrors.reportDB)
  const findUserByUsername = usersCollection.findUserByUsername(username)
    .then(errors.reportExistingUsername)
    .catch(errors.getLibraryErrors.reportDB)
  Promise.all([findUserByEmail, findUserByUsername])
    .then(saveUserIntoDB)
    .catch(sendErrorResponse)

  function saveUserIntoDB() {
    if (errors.noError()) {
      console.log("POGGERS");
    } else {
      console.log("wtf");
      console.log(errors.obtainError());
    }
  }

  function sendErrorResponse(error) {
    // const error = errors.getError()
    // res.status(error.code).send({ description: error.message})
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

