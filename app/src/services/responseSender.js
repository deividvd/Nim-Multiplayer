class ResponseSender {
  constructor(res) {
    this.res = res
  }

  sendSuccess(status) {
    this.res.status(status).send({ success: 'success' })
  }

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

module.exports = ResponseSender