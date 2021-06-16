const objectUtilitiesOf = require('../../utilities/object')

class RegisterErrors {
  constructor() {
    this.emailExists = false
    this.usernameExists = false
  }

  reportExistingEmailIfExist(user) {
    if (objectUtilitiesOf(user).isObjectType()) {
      console.log('Register error: a client tried to register an existing email')
      this.emailExists = true
    }
  }

  reportExistingUsernameIfExist(user) {
    if (objectUtilitiesOf(user).isObjectType()) {
      console.log('Register error: a client tried to register an existing username')
      this.usernameExists = true
    }
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