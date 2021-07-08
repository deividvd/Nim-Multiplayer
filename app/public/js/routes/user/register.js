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
        <h2> CREATE YOUR ACCOUNT </h2>

        <form>
          <p v-html="errorMessage"></p>
          <br/>
          <label for="username"> Username </label>
          <input id="username" v-model="username" type="text" placeholder="Enter Username" />
          <br/>
          <label for="email"> Email </label>
          <input id="email" v-model="email" type="email" placeholder="Enter Email" />
          <br/>
          <label for="password"> Password </label>
          <input id="password" v-model="password" type="password" placeholder="Enter Password" />
          <br/>
          <label for="confirm-password"> Confirm Password </label>
          <input id="confirm-password" v-model="confirmPassword" type="password" placeholder="Repeat Password" />
          <br/>
          <p>
            The password must have: 
            {{ passwordRequiredLenght }} characters,
            including a number, a lowercase and an uppercase letter.
          </p>
          <br/>
          <button v-on:click="register"> CREATE ACCOUNT </button>
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
    sessionRouting().goHomeIfUserIsLoggedIn()
  },
  methods: {
    register: function(event) {
      event.preventDefault()
      this.errorMessage = gatherErrorMessagesIn(this.username, this.email, 
          this.password, this.confirmPassword, this.passwordRequiredLenght)
      if (this.errorMessage === '') {
        const credential = {
          username: this.username,
          email: this.email,
          password: this.password
        }
        axios.post("https://localhost:3000/register", credential)
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

      function gatherErrorMessagesIn(username, email, password, confirmPassword, passwordRequiredLenght) {
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
