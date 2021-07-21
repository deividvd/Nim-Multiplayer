const GameRoom = {
  template:
  `
  <div>
    <section>
      <form>
        
      </form>
    </section>
  </div>
  `,
  data() {
    return {}
      // username: null,
      // socket: null,
  },
  mounted() {
    
  },
  methods: {
    goToAccount: function() {
      twoPageRoutingFrom(this).addParameters({}).goTo(AccountRoute)
    },
    goToLogin: function() {
      twoPageRoutingFrom(this).addParameters({}).goTo(LoginRoute)
    },
    goToRegister: function() {
      twoPageRoutingFrom(this).addParameters({}).goTo(RegisterRoute)
    },


    createGameRoom: function(event) {
      event.preventDefault()
    }
  }
}