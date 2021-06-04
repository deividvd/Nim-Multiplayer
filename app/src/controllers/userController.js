const mongoose = require('mongoose')
const UserSchema = require('../models/user')
const User = UserSchema(mongoose)

exports.register = function(req, res) {
  const credentials = req.body
  const email = credentials.email
  User.findOne({ email: email }, function(error, result) {
    console.log("error = " + error);
    console.log("result = " + result);
    if (error == null) {
      if (result == null) {
        res.send("email non presente");
        // verificare username
      } else {
        res.status(422).send({
					description: 'Email is already registered.'
				})
      }
    } else {
      res.status(500).send({ description: 'Unknow error' })
    }
  })
  /*
  // email already registered
  // username already exist
  User.findOne({ email: email }).exec((err, user) => {
    console.log(user);
    if (user) {
      errors.push({ msg: 'email already registered' });
      // TODO: username already registered
      render(res, errors, name, email, password, password2);
    } else {
      const newUser = new User({
        name: name,
        email: email,
        password: password
      });
      //hash password
      bcrypt.genSalt(10,(err,salt)=> 
      bcrypt.hash(newUser.password,salt,
          (err,hash)=> {
                if(err) throw err;
                    //save pass to hash
                    newUser.password = hash;
                //save user
                newUser.save()
                .then((value)=>{
                    console.log(value)
                res.redirect('/users/login');
                })
                .catch(value=> console.log(value));
                  
            }));
*/
}

exports.login = function(req, res) {
  res.status(200).send({ ok: "ok" })
  /*
  const credentials = req.body
  const username = credentials.username
  const password = credentials.password
  User.findOne({_id: username, password: password}, function(error, result) {
    if (result != null) {
      logInUser(res)
    } else if (result == null && error == null) {
      wrongCredential(res)
    } else {
      res.send(error)
    }
      console.log("error = " + error);
      console.log("result = " + result);
  })

  function logInUser(res) {
    res.status(200)
    /*
    // var session = ...
      session = req.session
      session.username = "TODO"
      session.email = "TODO.email"
    */
  }

  function wrongCredential(res) {
    res.status(404).send({
      description: 'wrong username or password'
    })
  }

