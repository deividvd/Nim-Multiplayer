const Register = {
  template:
    `
    <section>

      <form>
      
        <h2>REGISTER</h2>

        <p>{{ errorMessage }}</p>

        <input type="text" placeholder="Username"/>

        <input type="text" placeholder="Email@"/>

        <input type="password" placeholder="Password"/>

        <input type="password" placeholder="Confirm Password"/>
        
        <button v-on:click="register">Log in</button>

      </form>

    </section>
    `,
  data() {
    return {
      errorMessage: ""
    }
  },
  methods: {
    register: function(event) {
			event.preventDefault()
      this.errorMessage = "ERROR"
    }
  }
}