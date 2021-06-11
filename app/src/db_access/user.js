const mongoose = require('mongoose')
const UserModel = require('./models/user')
const User = UserModel(mongoose)


exports.findUserByEmail = function(email) {
  return User.findOne({ email: email }).lean()
}
  
exports.findUserByUsername = function(username) {
  return User.findById(username).lean()
}

exports.insertNewUser = function(username, email, password) {
  const newUser = new User({
    _id: username,
    email: email,
    password: password
  })
  return newUser.save()
}