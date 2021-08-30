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

        <p v-html="errorMessage" class="error-message"></p>

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
          this.errorMessage = gatherServerSideErrorsFrom(response)
          if (this.errorMessage === '') {
            logOutSuccessful(this)
          }
        })
        .catch((error) => { this.errorMessage = error })
      
      function gatherServerSideErrorsFrom(response) {
        if ( ! response.data.logout) {
          return 'You are not logged in. Please reload this page.'
        }
        return ''
      }

      function logOutSuccessful(vueComponent) {
        twoPageRoutingFrom(vueComponent).addParameters({}).backToPrevious()
      }
    },
    deleteAccount: function() {
      this.showPermanentlyDelete = true
    },
    permanentlyDeleteAccount: function() {
      axios.post(serverAddress + 'delete-account')
        .then((response) => {
          this.errorMessage = gatherServerSideErrorsFrom(response)
          if (this.errorMessage === '') {
            deleteAccountSuccessful(this)
          }
        })
        .catch((error) => { this.errorMessage = error })

      function gatherServerSideErrorsFrom(response) {
        if ( ! response.data.deleteAccount) {
          return 'Account not found. Please log out or clear your cookies, then try again.'
        }
        return ''
      }

      function deleteAccountSuccessful(vueComponent) {
        const deletionMessage = '): your account has been successfully deleted.'
        const nextPageParameters = { message: deletionMessage }
        twoPageRoutingFrom(vueComponent).addParameters(nextPageParameters).backToPrevious()
      }
    }
  }
}