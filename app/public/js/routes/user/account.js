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
    
    <main>
      <section>
        <p> Logged as: {{ username }} </p>

        <p v-html="errorMessage" class="errorMessage"></p>

        <button v-on:click="logout"> Sign out </button>
      
        <button id="delete-account" v-on:click="deleteAccount"> Delete your Account </button>
        <br/>
        <button v-if="showPermanentlyDelete" id="permanently-delete-account" v-on:click="permanentlyDeleteAccount">
          ARE YOU SURE?
          <br/>
          Click here to
          <br/>
          PERMANENTLY DELETE
          <br/>
          your account.
        </button>
      </section>
    </main>

  </div>
  `,
  data() {
    return {
      username: null,
      errorMessage: '',
      showPermanentlyDelete: false,
    }
  },
  mounted() {
    sessionUtilities().goHomeIfUserIsLoggedOut(this)
    sessionUtilities().setUsernameOf(this)
  },
  methods: {
    logout: function() {
      axios.post(serverAddress + 'logout')
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
    permanentlyDeleteAccount: function() {
      axios.post(serverAddress + 'delete-account')
        .then((response) => {
          responseResolverOf(this).addSuccessBehavior(successOf).resolve(response)

          function successOf(vueComponent) {
            const deletionMessage = '): your account has been successfully deleted.'
            const nextPageParameters = { message: deletionMessage }
            twoPageRoutingFrom(vueComponent).addParameters(nextPageParameters).backToPrevious()
          }
        })
        .catch((error) => { this.errorMessage = error })
    }
  }
}