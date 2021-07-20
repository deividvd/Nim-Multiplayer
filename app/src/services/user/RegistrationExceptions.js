const objectUtilitiesOf = require('../../utilities/object')

class RegistrationExceptions {
  constructor() {
    this.emailExists = false
    this.usernameExists = false
  }

  addExistingEmailIfExist(user) {
    if (objectUtilitiesOf(user).isObjectType()) {
      console.log('Register error: a client tried to register an existing email')
      this.emailExists = true
    }
  }

  addExistingUsernameIfExist(user) {
    if (objectUtilitiesOf(user).isObjectType()) {
      console.log('Register error: a client tried to register an existing username')
      this.usernameExists = true
    }
  }
  
  obtainExceptionMessage() {
    var exceptionMessage = ''
    if (this.emailExists) {
      exceptionMessage = 'The email is already registered.'
    }
    if (this.usernameExists) {
      exceptionMessage = exceptionMessage.concat(' <br/> The username is already taken.')
    }
    return exceptionMessage
  }
}

module.exports = RegistrationExceptions