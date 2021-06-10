const bcrypt = require('bcrypt')
const saltRounds = 10

exports.encrypt = function(password) {
  return bcrypt.hash(password, saltRounds)
}

exports.compare = function(password, encryptedPassword) {
  return bcrypt.compare(password, encryptedPassword)
}