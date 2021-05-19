const mongoose = require('mongoose')
const UserSchema = require("/models/user.js")
User = UserSchema(mongoose)

exports.testdb = function(req, res) {
  User.findOne({}, {}, { sort: { released: -1 } }, (err, movie) => {
    if (err || movie == null) {
      res.send("error")
    }
    else {
      res.json(movie)
    }
  })
}
