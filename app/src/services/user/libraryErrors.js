const errorCode = 500
const db = {
  description: 'Internal Server Error 1',
  occurred: false
}
const encryption = {
  description: 'Internal Server Error 2',
  occurred: false
}

exports.reportDB = function(error) {
  console.log("Mongoose error:")
  console.log(error)
  db.occurred = true
}

exports.reportEncryption = function(error) {
  console.log("bcrypt library error:")
  console.log(error)
  encryption.occurred = true
}

exports.noError = function() {
  return ! (db.occurred || encryption.occurred)
}

exports.obtainError = function() {
  if (db.occurred) {
    return {
      code: errorCode,
      description: db.description
    }
  }
  if (encryption.occurred) {
    return {
      code: errorCode,
      description: encryption.description
    }
  }
  return null
}