const UserSection = {
  template:
  `
  <section>
    <p v-html="errorMessage" class="errorMessage"></p>

    <div v-if="username">
      <p> Logged as: {{ username }} </p>
      <button v-on:click="goToAccount" type="button"> Manage Account </button>
    </div>
    <div v-else>
      <div> {{ this.$route.params.message }} </div>
      <button v-on:click="goToLogin" type="button"> Login </button>
      <button v-on:click="goToRegister" type="button"> Register </button>
    </div>
  </section>
  `,
  data() {
    return {
      errorMessage: '',
      username: null
    }
  },
  mounted() {
    sessionUtilities().setUsernameOf(this)
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