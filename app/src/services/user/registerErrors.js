const objectUtilities = require('../../utilities/object')

class RegisterErrors {
  constructor() {
    this.emailExists = false
    this.usernameExists = false
  }
  reportExistingEmail(user) {
    if (objectUtilities(user).doesExist()) {
      console.log('A client tried to register an existing email')
      this.emailExists = true
    }
  }
  reportExistingUsername(user) {
    if (objectUtilities(user).doesExist()) {
      console.log('A client tried to register an existing username')
      this.usernameExists = true
    }
  }
  noError() {
    return ! (this.emailExists || this.usernameExists)
  }
  obtainErrorMessage() {
    var errorMessage = ''
    if (this.emailExists) {
      errorMessage = 'The email is already registered. <br/>'
    }
    if (this.usernameExists) {
      errorMessage = errorMessage.concat('The username is already taken.')
    }
    return errorMessage
  }
}

module.exports = RegisterErrors