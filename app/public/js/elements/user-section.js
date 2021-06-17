const UserSection = {
  template:
  `
  <section>
    <div v-if="userLoggedIn">
      <p> Welcome, {{ username }} </p>
      <button v-on:click="goToAccount" type="button"> MANAGE ACCOUNT </button>
    </div>
    <div v-else>
      <div> {{ this.$route.params.registrationMessage }} </div>
      <button v-on:click="goToLogin" type="button"> LOG IN </button>
      <button v-on:click="goToRegister" type="button"> REGISTER </button>
    </div>
  </section>
  `,
  data() {
    return {
      userLoggedIn: false,
      username: ''
    }
  },
  mounted() {
    axios.get("https://localhost:3000/get-user-logged-in")
      .then(response => {
        if (response.data.username) {
          this.userLoggedIn = true
          this.username = response.data.username
        }
      })
  },
  methods: {
    goToAccount: function() {
      this.$parent.goToAccount()
    },
    goToLogin: function() {
      this.$parent.goToLogin()
    },
    goToRegister: function() {
      this.$parent.goToRegister()
    }
  }
}