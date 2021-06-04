const Home = {
  components: {
    'main-header': MainHeader,
    'login-section': LoginSection,
    'how-to-play': HowToPlay
  },
  template:
  `
  <div>

    <main-header/>

    <section>
      <p>
        {{ this.$route.params.message }}
      </p>
    </section>

    <section>
      <router-link to="/create-game-room">
        <button type="button"> CREATE GAME ROOM </button>
      </router-link>
    </section>

    <login-section/>

    <how-to-play/>

    <footer id="informativeLinks">
      <router-link to="/terms-of-service"> TERMS OF SERVICE </router-link>
      <hr/>
      <router-link to="/privacy"> PRIVACY </router-link>
      <hr/>
      <a href="https://www.facebook.com/" target="_blank"> Facebook </a>
      <hr/>
      <a href="https://twitter.com/" target="_blank"> Twitter </a>
    </footer>

  </div>
  `,
  methods: {
    register: function() {
      RoutingUtilities(this).addParameters({}).goTo(RegisterRoute)
    },
    login: function() {
      RoutingUtilities(this).addParameters({}).goTo(LoginRoute)
    }
  }
}
