module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var UserSchema = new Schema({
      _id: String,
      email: String,
      password: String
    });
    return mongoose.model('User', UserSchema);
};
