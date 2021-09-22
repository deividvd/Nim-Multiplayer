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
          <label for="username"> Username </label>
          <input id="username" v-model="username" type="text" placeholder="Enter Username" />
          
          <label for="password"> Password </label>
          <input id="password" v-model="password" type="password" placeholder="Enter Password" />
          
          <p v-html="errorMessage" class="error-message"></p>

          <button v-on:click="login" type="submit"> Sign in </button>
        </form>
      </section>
    </main>

  </div>
  `,
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    }
  },
  mounted() {
    sessionUtilitiesOf(this).goHomeIfUserIsLoggedIn()
  },
  methods: {
    login: function(event) {
      event.preventDefault()
      this.errorMessage = gatherClientSideErrorsFrom(this)
      if (this.errorMessage === '') {
        const credential = {
          username: this.username,
          password: this.password
        }
        axios.post(serverAddress + 'login', credential)
          .then((response) => {
            this.errorMessage = gatherServerSideErrorsFrom(response)
            if (this.errorMessage === '') {
              logInSuccessful(this)
            }
          })
			    .catch((error) => { this.errorMessage = error })
      }

      function gatherClientSideErrorsFrom(vueComponent) {
        const username = vueComponent.username
        const password = vueComponent.password
        var errorMessage = ''
        applyMissingInputError()
        return errorMessage

        function applyMissingInputError() {
          if (username === '' || password === '')
            errorMessage = errorMessage.concat('Please fill in all fields for login.')
        }
      }

      function gatherServerSideErrorsFrom(response) {
        if ( ! response.data.login) {
          return 'Incorrect username or password.'
        }
        return ''
      }

      function logInSuccessful(vueComponent) {
        twoPageRoutingFrom(vueComponent).addParameters({}).backToPrevious()
      }
    }
  }
}
