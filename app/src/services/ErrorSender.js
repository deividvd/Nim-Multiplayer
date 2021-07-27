class ErrorSender {
  constructor(res) {
    this.res = res
  }

  /**
   * Send an exceptionMessage as response.
   * 
   * @param {string} exceptionMessage - "exception" Message and not "error" Message,
   * because only the user can resolve this error, by changing some inputs or settings.
   */
  sendExceptionMessage(exceptionMessage) {
    this.res.send({ exceptionMessage : exceptionMessage })
  }

  sendDatabaseError(dbError) {
    console.log('Database Error:')
    console.log(dbError)
    this.res.status(500).send(newErrorMessage('Internal Server Error 1.'))
  }

  sendEncryptError(encryptError) {
    console.log('Encryption Error:')
    console.log(encryptError)
    this.res.status(500).send(newErrorMessage('Internal Server Error 2.'))
  }
  
  sendDecryptError(decryptError) {
    console.log('Decryption Error:')
    console.log(decryptError)
    this.res.status(500).send(newErrorMessage('Internal Server Error 3.'))
  }
}

function newErrorMessage(errorMessage) {
  return { errorMessage: errorMessage }
}

module.exports = ErrorSender