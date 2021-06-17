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
          <input id="username" v-model="username" type="text" placeholder="Enter Username" />
          <br/>
          <label for="password"> Password </label>
          <input id="password" v-model="password" type="password" placeholder="Enter Password" />
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
  mounted() {
    sessionRouting().goHomeIfUserIsLoggedIn()
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
          .then(response => {
            if (response.data.success) {
              twoPageRoutingFrom(this).addParameters({}).backToPreviousRoute()
			      } else {
              if (response.data.errorMessage) {
                this.errorMessage = response.data.errorMessage
              } else {
                this.errorMessage = 'Unknow error.'
              }
            }
          })
			    .catch(error => {
            this.errorMessage = error
          })
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
