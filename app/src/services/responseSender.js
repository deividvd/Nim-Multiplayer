exports.success = function(res) {
  return {
    sendStatus
  }

  function sendStatus(status) {
    res.status(status).send({ success: 'success' })
  }
}

exports.exception = function(res) {
  return {
    sendMessage
  }

  function sendMessage(exceptionMessage) {
    res.send({ exceptionMessage : exceptionMessage })
  }
}

exports.error = function(res) {
  return {
    sendDatabaseError,
    sendEncryptError,
    sendDecryptError,
    sendMalformedRequestError
  }

  function sendDatabaseError(dbError) {
    console.log('Database Error:')
    console.log(dbError)
    res.status(500).send(newErrorMessage('Internal Server Error 1.'))
  }

  function sendEncryptError(encryptError) {
    console.log('Encryption Error:')
    console.log(encryptError)
    res.status(500).send(newErrorMessage('Internal Server Error 2.'))
  }

  function sendDecryptError(decryptError) {
    console.log('Decryption Error:')
    console.log(decryptError)
    res.status(500).send(newErrorMessage('Internal Server Error 3.'))
  }

  function sendMalformedRequestError() {
    console.log('Malformed Request')
    res.status(500).send(newErrorMessage('Internal Server Error 4.'))
  }

  function newErrorMessage(errorMessage) {
    return { errorMessage: errorMessage }
  }
}