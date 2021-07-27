const mongoose = require('mongoose')
const UserModel = require('./models/user')
const User = UserModel(mongoose)

exports.insertNewUser = function(username, email, password) {
  const newUser = new User(
    {
      _id: username,
      email: email,
      password: password
    }
  )
  return newUser.save()
}

exports.deleteUserByUsername = function(username) {
  return User.deleteOne({ _id: username }).lean()
}

exports.findUserByUsername = function(username) {
  return User.findById(username).lean()
}

exports.findUserByEmail = function(email) {
  return User.findOne({ email: email }).lean()
}
