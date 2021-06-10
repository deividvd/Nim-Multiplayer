const objectUtilities = require('../../utilities/object')
const errorCode = 422
const libraryErrors = require('./libraryErrors')
const emailExists = {
  description: 'The email is already registered. ',
  occurred: false
}
const usernameExists = {
  description: 'The username is already taken. ',
  occurred: false
}

exports.getLibraryErrors = function() {
  return libraryErrors
}

exports.reportExistingEmail = function(email) {
  if (objectUtilities(email).doesExist()) {
    console.log("A client tried to register an existing email")
    emailExists.occurred = true
  }
}

exports.reportExistingUsername = function(username) {
  if (objectUtilities(username).doesExist()) {
    console.log("A client tried to register an existing username")
    usernameExists.occurred = true
  }
}

exports.noError = function() {
  return (libraryErrors.noError()
    && ! (emailExists.occurred || usernameExists.occurred))
}

exports.obtainError = function() {
  const libraryError = libraryErrors.obtainError()
  if (objectUtilities(libraryError).doesExist()) {
    return libraryError
  }
  if (emailExists.occurred) {
    return {
      code: errorCode,
      description: emailExists.description
    }
  }
  if (usernameExists.occurred) {
    return {
      code: errorCode,
      description: usernameExists.description
    }
  }
  return null
}
