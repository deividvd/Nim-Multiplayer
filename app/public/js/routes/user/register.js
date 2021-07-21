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
          <p v-html="errorMessage"></p>

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
          
          <button v-on:click="register" type="submit"> Sign up </button>
        </form>
      </section>
    </main>
    
  </div>
  `,
  data() {
    return {
      errorMessage: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordRequiredLenght: 8
    }
  },
  mounted() {
    sessionUtilities().goHomeIfUserIsLoggedIn()
  },
  methods: {
    register: function(event) {
      event.preventDefault()
      this.errorMessage = gatherErrorMessagesIn(this)
      if (this.errorMessage === '') {
        const credential = {
          username: this.username,
          email: this.email,
          password: this.password
        }
        axios.post(serverAddress + 'register', credential)
          .then((response) => {
            responseResolverOf(this).addSuccessBehavior(successOf).resolve(response)

            function successOf(vueComponent) {
              const registrationMessage = 'Congratulations, your account has been successfully created!'
              const nextPageParameters = { message: registrationMessage }
              twoPageRoutingFrom(vueComponent).addParameters(nextPageParameters).backToPrevious()
            }
          })
          .catch((error) => { this.errorMessage = error })
      }

      function gatherErrorMessagesIn(vueComponent) {
        const username = vueComponent.username
        const email = vueComponent.email
        const password = vueComponent.password
        const confirmPassword = vueComponent.confirmPassword
        const passwordRequiredLenght = vueComponent.passwordRequiredLenght
        var htmlErrorMessage = ''
        applyMissingInputError()
        applyPasswordsDoNotMatchError()
        applyPasswordIsShortError()
        applyPasswordDoesntHaveNumberError()
        applyPasswordDoesntHaveUppercaseError()
        applyPasswordDoesntHaveLowercaseError()
        return htmlErrorMessage
      
        function applyMissingInputError() {
          if (username === '' || email === '' || password === '' || confirmPassword === '') {
            htmlErrorMessage = 
                htmlErrorMessage.concat('Please fill in all fields for register. <br/>')
          }
        }
      
        function applyPasswordsDoNotMatchError() {
          if (password != confirmPassword) {
            htmlErrorMessage = 
                htmlErrorMessage.concat('The passwords entered do not match. <br/>')
          }
        }
      
        function applyPasswordIsShortError() {
          if (password.length < passwordRequiredLenght) {
            htmlErrorMessage = 
                htmlErrorMessage.concat('The password must be at least '
                + passwordRequiredLenght + ' characters long. <br/>')
          }
        }
      
        function applyPasswordDoesntHaveNumberError() {
          if ( ! (/[1-9]/.test(password))) {
            htmlErrorMessage = 
                htmlErrorMessage.concat('The password must contain a number. <br/>')
          }
        }
      
        function applyPasswordDoesntHaveUppercaseError() {
          if ( ! (/[A-Z]/.test(password))) {
            htmlErrorMessage = 
                htmlErrorMessage.concat('The password must contain an uppercase letter. <br/>')
          }
        }
      
        function applyPasswordDoesntHaveLowercaseError() {
          if ( ! (/[a-z]/.test(password))) {
            htmlErrorMessage = 
                htmlErrorMessage.concat('The password must contain a lowercase letter.')
          }
        }
      }
    }
  }
}
