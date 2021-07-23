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
    const usernameIsTakenMessage = 'The username is already taken.'
    if (this.emailExists && this.usernameExists) {
      exceptionMessage = exceptionMessage.concat(' <br/> ' + usernameIsTakenMessage)
    } else if (this.usernameExists) {
      exceptionMessage = usernameIsTakenMessage
    }
    return exceptionMessage
  }
}

module.exports = RegistrationExceptions