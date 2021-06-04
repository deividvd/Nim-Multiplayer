const LoginSection = {
  template:
  `
  <section>
    <button v-on:click="login"> LOGIN </button>
    <button v-on:click="register"> REGISTER </button>
  </section>
  `,
  methods: {
    register: function() {
      this.$parent.register()
    },
    login: function() {
      this.$parent.login()
    }
  }
}