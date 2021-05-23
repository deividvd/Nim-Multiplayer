const Login = {
  template:
    `
    <section>

      <form>

        <h2>LOGIN</h2>

        <p>{{ errorMessage }}</p>

        <input type="text" placeholder="Username"/>

        <input type="password" placeholder="Password"/>
        
        <button v-on:click="login">Log in</button>
        
      </form>

    </section>
    `,
  data() {
    return {
      errorMessage: ""
    }
  },
  methods: {
    login: function(event) {
			event.preventDefault()
      this.errorMessage = "ERROR"
    }
  }
}
