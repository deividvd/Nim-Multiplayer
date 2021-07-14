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

      <p> Logged as: {{ username }} </p>

      <button v-on:click="logout"> Sign out </button>
      
      <button id="delete-account" v-on:click="deleteAccount"> Delete your Account </button>
      <br/>
      <form v-if="showPermanentlyDelete">
        <button id="permanently-delete-account" v-on:click="permanentlyDeleteAccount" type="submit"> ARE YOU SURE? <br/> Click here to <br/> PERMANENTLY DELETE <br/> your account. </button>
      </form>
    </section>

  </div>
  `,
  data() {
    return {
      username: null,
      errorMessage: '',
      showPermanentlyDelete: false
    }
  },
  mounted() {
    sessionUtilities().goHomeIfUserIsLoggedOutAndSetUsernameOf(this)
  },
  methods: {
    logout: function() {
      axios.post("https://localhost:3000/logout")
        .then((response) => {
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