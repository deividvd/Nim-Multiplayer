module.exports = function(mongoose) {
  const Schema = mongoose.Schema
  const UserSchema = new Schema(
    {
      /** The username. */
      _id: String,
      email: String,
      password: String
    },
    { versionKey: false }
  )
  return mongoose.model('User', UserSchema) // 'User' means 'users' collection
}
