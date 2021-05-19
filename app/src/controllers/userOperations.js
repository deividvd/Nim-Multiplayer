exports.register = function(req, res) {
  const { name, email, password, confirmPassword } = req.body
  const errors = gatherFormErrors(name, email, password, confirmPassword)


  if (errors.length > 0) {
    // send errors to the html page
    res.json({
      errors: errors,
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    })
  } else {
    //validation passed
    /*
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

  function gatherFormErrors(username, email, password, confirmPassword) {
    console.log('DEBUGGING: Name ' + username + ' email :' + email + ' pass:' + password)
    const errors = []
    if (isMissingInputs()) {
      errors.push({ msg: "Please fill in all fields for register." })
    }
    if (passwordsNotMatch()) {
      errors.push({ msg: "The passwords entered do not match." })
    }
    if (isPasswordShort()) {
      errors.push({msg: 'Password must be at least ' + requiredLenght + ' characters long.'})
    }
    return errors

    function isMissingInputs() {
      return ( ! username || ! email || ! password || ! confirmPassword)
    }

    function passwordsNotMatch() {
      return (password !== confirmPassword)
    }

    function isPasswordShort() {
      const requiredLenght = 6
      return (password.length > requiredLenght)
    }
  }
}


// var session = ....
exports.login = function(req, res) {
  req.body
  // TODO verify user in DB
  session = req.session
  session.username = "TODO"
  session.email = "TODO.email"
}