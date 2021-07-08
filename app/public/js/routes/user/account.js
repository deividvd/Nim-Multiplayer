const Account = {
  components: {
    'app-header': AppHeader,
    'go-back-button': GoBackButton
  },
  template:
  `
  <div>

    <app-header/>

    <go-back-button/>
    
    <section>
      <p v-html="errorMessage"></p>
      <br/>
      <button v-on:click="logout"> LOG OUT </button>
      <button v-on:click="deleteAccount"> DELETE YOUR ACCOUNT </button>
      <form v-if="showPermanentlyDelete">
        <label> ARE YOU SURE? D: </label>
        <br/>
        <button v-on:click="permanentlyDeleteAccount" type="submit"> PERMANENTLY DELETE YOUR ACCOUNT </button>
      </form>
    </section>

  </div>
  `,
  data() {
    return {
      errorMessage: '',
      showPermanentlyDelete: false
    }
  },
  mounted() {
    sessionRouting().goHomeIfUserIsLoggedOut()
  },
  methods: {
    logout: function() {
      axios.post("https://localhost:3000/logout")
        .then((response) => {
          console.log(response);
          responseResolverOf(this).addSuccessBehavior(successOf).resolve(response)

          function successOf(vueComponent) {
            twoPageRoutingFrom(vueComponent).addParameters({}).backToPrevious()
          }
        })
        .catch((error) => { this.errorMessage = error })
    },
    deleteAccount: function() {
      this.showPermanentlyDelete = true
    },
    permanentlyDeleteAccount: function(event) {
      event.preventDefault()
      axios.post("https://localhost:3000/delete-account")
        .then((response) => {
          responseResolverOf(this).addSuccessBehavior(successOf).resolve(response)

          function successOf(vueComponent) {
            const deletionMessage = '): your account has been successfully deleted ):'
            const nextPageParameters = { message: deletionMessage }
            twoPageRoutingFrom(vueComponent).addParameters(nextPageParameters).backToPrevious()
          }
        })
        .catch((error) => { this.errorMessage = error })
    }
  }
}