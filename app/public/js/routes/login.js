const Login = {
  components: {
    'app-header': AppHeader,
  },
  template:
  `
  <div>

    <app-header/>

    <main>
      <section>
        <h2> LOG IN </h2>

        <form>
          <p v-html="errorMessage"></p>
          <br/>
          <label for="username"> Username </label>
          <input id="username" v-model="username" type="text" placeholder="Username" />
          <br/>
          <label for="password"> Password </label>
          <input id="password" v-model="password" type="password" placeholder="Password" />
          <br/>
          <button v-on:click="login"> LOG IN </button>
        </form>
      </section>
    </main>

  </div>
  `,
  data() {
    return {
      errorMessage: '',
      username: '',
      password: ''
    }
  },
  methods: {
    login: function(event) {
      event.preventDefault()
      this.errorMessage = gatherErrorMessagesIn(this.username, this.password)
      if (noErrorIn(this.errorMessage)) {
        const credential = {
          username: this.username,
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

      function gatherErrorMessagesIn(username, password) {
        var htmlErrorMessage = ''
        applyMissingInputError()
        return htmlErrorMessage

        function applyMissingInputError() {
          if (username === '' || password === '') {
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
