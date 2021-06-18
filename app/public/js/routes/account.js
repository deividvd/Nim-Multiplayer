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
      <button v-on:click="logout"> LOG OUT </button>
      <button v-on:click="deleteAccount"> DELETE ACCOUNT </button>
      
    </section>

  </div>
  `,
  mounted() {
    sessionRouting().goHomeIfUserIsLoggedOut()
  },
  methods: {
    logout: function() {
      axios.get("https://localhost:3000/logout")
        .then((response) => {
          twoPageRoutingFrom(this).addParameters({}).backToPreviousRoute()
        })
        .catch((error) => {
          twoPageRoutingFrom(this).addParameters({}).backToPreviousRoute()
        })
    },
    deleteAccount: function() {
      console.log("delete account");
    },
    // (B) CONFIRM
    demoB: function() {
      if (confirm("Continue?")) { alert("Yes"); }
    }
  }
}