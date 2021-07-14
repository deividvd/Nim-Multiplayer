const Login = {
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
        <h2> Login </h2>

        <form>
          <p v-html="errorMessage"></p>
          
          <label for="username"> Username </label>
          <input id="username" v-model="username" type="text" placeholder="Enter Username" />
          
          <label for="password"> Password </label>
          <input id="password" v-model="password" type="password" placeholder="Enter Password" />
          
          <br/>
          <button v-on:click="login" type="submit"> Sign in </button>
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
  mounted() {
    sessionUtilities().goHomeIfUserIsLoggedIn()
  },
  methods: {
    login: function(event) {
      event.preventDefault()
      this.errorMessage = gatherErrorMessagesIn(this.username, this.password)
      if (this.errorMessage === '') {
        const credential = {
          username: this.username,
          password: this.password
        }
        axios.post("https://localhost:3000/login", credential)
          .then((response) => {
            responseResolverOf(this).addSuccessBehavior(successOf).resolve(response)

            function successOf(vueComponent) {
              twoPageRoutingFrom(vueComponent).addParameters({}).backToPrevious()
            }
          })
			    .catch((error) => { this.errorMessage = error })
      }

      function gatherErrorMessagesIn(username, password) {
        var htmlErrorMessage = ''
        applyMissingInputError()
        return htmlErrorMessage

        function applyMissingInputError() {
          if (username === '' || password === '') {
            htmlErrorMessage = 
                htmlErrorMessage.concat('Please fill in all fields for login.')
          }
        }
      }
    }
  }
}
