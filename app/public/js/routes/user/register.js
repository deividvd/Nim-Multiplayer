const Register = {
  components: {
    'app-header': AppHeader,
    'go-back-button': GoBackButton
  },
  template:
  `
  <div>

    <app-header/>

    <go-back-button/>

    <main>
      <section>
        <h2> Create your Account </h2>

        <form>
          <label for="username"> Username </label>
          <input id="username" v-model="username" type="text" placeholder="Enter Username" />
          
          <label for="email"> Email </label>
          <input id="email" v-model="email" type="email" placeholder="Enter Email" />
          
          <label for="password"> Password </label>
          <input id="password" v-model="password" type="password" placeholder="Enter Password" />
          
          <label for="confirm-password"> Confirm Password </label>
          <input id="confirm-password" v-model="confirmPassword" type="password" placeholder="Repeat Password" />
          
          <p>
            The password must have: 
            {{ passwordRequiredLenght }} characters,
            including a number, a lowercase and an uppercase letter.
          </p>

          <p v-html="errorMessage" class="error-message"></p>
          
          <button v-on:click="register" type="submit"> Sign up </button>
        </form>
      </section>
    </main>
    
  </div>
  `,
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordRequiredLenght: 8,
      errorMessage: '',
    }
  },
  mounted() {
    sessionUtilities().goHomeIfUserIsLoggedIn(this)
  },
  methods: {
    register: function(event) {
      event.preventDefault()
      this.errorMessage = gatherClientSideErrorsFrom(this)
      if (this.errorMessage === '') {
        const credential = {
          username: this.username,
          email: this.email,
          password: this.password
        }
        axios.post(serverAddress + 'register', credential)
          .then((response) => {
            this.errorMessage = gatherServerSideErrorsFrom(response)
            if (this.errorMessage === '') {
              registrationSuccessful(this)
            }
          })
          .catch((error) => { this.errorMessage = error })
      }

      function gatherClientSideErrorsFrom(vueComponent) {
        const username = vueComponent.username
        const email = vueComponent.email
        const password = vueComponent.password
        const confirmPassword = vueComponent.confirmPassword
        const passwordRequiredLenght = vueComponent.passwordRequiredLenght
        var errorMessage = ''
        applyMissingInputError()
        applyPasswordsDoNotMatchError()
        applyPasswordIsShortError()
        applyPasswordDoesntHaveNumberError()
        applyPasswordDoesntHaveUppercaseError()
        applyPasswordDoesntHaveLowercaseError()
        return errorMessage
      
        function applyMissingInputError() {
          if (username === '' || email === '' || password === '' || confirmPassword === '')
            errorMessage = errorMessage.concat('Please fill in all fields for register. <br/>')
        }
      
        function applyPasswordsDoNotMatchError() {
          if (password != confirmPassword)
            errorMessage = errorMessage.concat('The passwords entered do not match. <br/>')
        }
      
        function applyPasswordIsShortError() {
          if (password.length < passwordRequiredLenght)
            errorMessage = errorMessage.concat('The password must be at least ' + passwordRequiredLenght + ' characters long. <br/>')
        }
      
        function applyPasswordDoesntHaveNumberError() {
          if ( ! (/[1-9]/.test(password)))
            errorMessage = errorMessage.concat('The password must contain a number. <br/>')
        }
      
        function applyPasswordDoesntHaveUppercaseError() {
          if ( ! (/[A-Z]/.test(password)))
            errorMessage = errorMessage.concat('The password must contain an uppercase letter. <br/>')
        }
      
        function applyPasswordDoesntHaveLowercaseError() {
          if ( ! (/[a-z]/.test(password)))
            errorMessage = errorMessage.concat('The password must contain a lowercase letter.')
        }
      }

      function gatherServerSideErrorsFrom(response) {
        var errorMessage = ''
        const emailExists = response.data.emailExists
        const emailExistMessage = 'The email is already registered.'
        const usernameExists = response.data.usernameExists
        const usernameExistsMessage = 'The username is already taken.'
        const usernameExceedsMaxLenght = response.data.usernameExceedsMaxLenght
        const usernameExceedsMaxLenghtMessage = 'The username must be at maximum 16 characters long.'
        if (emailExists) {
          errorMessage = emailExistMessage
        } 
        if (usernameExists) {
          if (errorMessage === '') {
            errorMessage = usernameExistsMessage
          } else {
            errorMessage = errorMessage.concat(' <br/> ' + usernameExistsMessage)
          }
        }
        if (usernameExceedsMaxLenght) {
          if (errorMessage === '') {
            errorMessage = usernameExceedsMaxLenghtMessage
          } else {
            errorMessage = errorMessage.concat(' <br/> ' + usernameExceedsMaxLenghtMessage)
          }
        }
        return errorMessage
      }

      function registrationSuccessful(vueComponent) {
        const registrationMessage = 'Congratulations, your account has been successfully created!'
        const nextPageParameters = { message: registrationMessage }
        twoPageRoutingFrom(vueComponent).addParameters(nextPageParameters).backToPrevious()
      }
    }
  }
}
