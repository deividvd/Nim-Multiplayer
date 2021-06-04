const Login = {
  components: {
    'main-header': MainHeader,
  },
  template:
  `
  <div>

    <main-header/>

    <section>
      <h2> LOG IN </h2>

      <form>
        <p v-html="errorMessage"></p>
        <br/>
        <label for="username-email"> Username or Email </label>
        <input id="username-email" v-model="usernameOrEmail" type="text" placeholder="Username or Email" />
        <br/>
        <label for="password"> Password </label>
        <input id="password" v-model="password" type="password" placeholder="Password" />
        <br/>
        <button v-on:click="login"> LOG IN </button>
      </form>
    </section>

  </div>
  `,
  data() {
    return {
      errorMessage: '',
      usernameOrEmail: '',
      password: ''
    }
  },
  methods: {
    login: function(event) {
      event.preventDefault()
      this.errorMessage = gatherErrorMessagesIn(this.usernameOrEmail, this.password)
      if (noErrorIn(this.errorMessage)) {
        const credential = {
          usernameOrEmail: this.usernameOrEmail,
          password: this.password
        }
        axios.post("https://localhost:3000/login", credential)
          .then(response => {
            // response === status 200
            console.log(response.data)
            const loginMessage = 'Log in successful!'
            const dataObject = {message: loginMessage}
            RoutingUtilities(this).addParameters(dataObject).backToPreviousRoute()
			    })
			    .catch(error => {
            // TODO check server errors ??? (status == ...)
            (console.log(error))
          })
      }

      function gatherErrorMessagesIn(usernameOrEmail, password) {
        var htmlErrorMessage = ''
        applyMissingInputError()
        return htmlErrorMessage

        function applyMissingInputError() {
          if (usernameOrEmail === '' || password === '') {
            htmlErrorMessage = 
                htmlErrorMessage.concat('Please fill in all fields for register. <br/>')
          }
        }
      }

      function noErrorIn(errorMessage) {
        return (errorMessage === '')
      }
    }
  }
}
