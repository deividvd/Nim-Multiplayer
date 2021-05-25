const Register = {
  template:
    `
    <section>

      <form>
      
        <h2>REGISTER</h2>

        <p v-html="errorMessage"></p>

        <input v-model="username" type="text" placeholder="Username"/>

        <input v-model="email" type="text" placeholder="email@"/>

        <input v-model="password" type="password" placeholder="Password"/>

        <input v-model="confirmPassword" type="password" placeholder="Confirm Password"/>
        
        <p>
          The password must have: 
          {{ passwordRequiredLenght }} characters,
          including a number,
          a lowercase and an uppercase letter.
        </p>

        <button v-on:click="register">Log in</button>

      </form>

    </section>
    `,
  data() {
    return {
      errorMessage: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordRequiredLenght: 8,
    }
  },
  methods: {
    register: function(event) {
      event.preventDefault()
      this.errorMessage = gatherErrorMessagesInForm(this.username, this.email,
          this.password, this.confirmPassword, this.passwordRequiredLenght)
      if (this.errorMessage.length === 0) {
        const credentials = { username: this.username, email: this.email, password: this.password }
        axios.post("https://localhost:3000/register", credentials)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            // status 500 == error
            console.log(error)
          });

      }
    }
  }
}

function gatherErrorMessagesInForm(username, email, password, confirmPassword, passwordRequiredLenght) {
  var htmlErrorMessage = new String('')
  tryAddMissingInputError()
  tryAddPasswordsDoNotMatchError()
  tryAddPasswordIsShortError()
  tryAddPasswordDoesntHaveNumberError()
  tryAddPasswordDoesntHaveUppercaseError()
  tryAddPasswordDoesntHaveLowercaseError()
  return htmlErrorMessage

  function tryAddMissingInputError() {
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      htmlErrorMessage = htmlErrorMessage.concat('Please fill in all fields for register. <br/>')
    }
  }

  function tryAddPasswordsDoNotMatchError() {
    if (password != confirmPassword) {
      htmlErrorMessage = htmlErrorMessage.concat('The passwords entered do not match. <br/>')
    }
  }

  function tryAddPasswordIsShortError() {
    if (password.length < passwordRequiredLenght) {
      htmlErrorMessage = htmlErrorMessage.concat('The password must be at least '
        + passwordRequiredLenght + ' characters long. <br/>')
    }
  }

  function tryAddPasswordDoesntHaveNumberError() {
    if ( ! (/[1-9]/.test(password))) {
      htmlErrorMessage = htmlErrorMessage.concat('The password must contain a number. <br/>')
    }
  }

  function tryAddPasswordDoesntHaveUppercaseError() {
    if ( ! (/[A-Z]/.test(password))) {
      htmlErrorMessage = htmlErrorMessage.concat('The password must contain an uppercase letter. <br/>')
    }
  }

  function tryAddPasswordDoesntHaveLowercaseError() {
    if ( ! (/[a-z]/.test(password))) {
      htmlErrorMessage = htmlErrorMessage.concat('The password must contain a lowercase letter.')
    }
  }
}
