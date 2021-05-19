module.exports = function(mongoose) {
  const Schema = mongoose.Schema
  const UserSchema = new Schema({
    _id: String,
    email: String,
    password: String
  })
  return mongoose.model('User', UserSchema)
}
