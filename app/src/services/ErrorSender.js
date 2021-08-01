/**
 * This class must be the unique entry point for sending errors to the client.
 * 
 * In this way, error sending is encapsulated in this class,
 * and it's easy to keep it consistent in all the application code.
 */
class ErrorSender {
  constructor(res) {
    this.res = res
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