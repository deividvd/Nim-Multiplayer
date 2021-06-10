const Home = {
  components: {
    'app-header': AppHeader,
    'login-section': LoginSection,
    'how-to-play': HowToPlay
  },
  template:
  `
  <div>

    <app-header/>

    <section>
      <p>
        {{ this.$route.params.message }}
      </p>
    </section>

    <main>
      <section>
        <router-link to="/create-game-room">
          <button type="button"> CREATE GAME ROOM </button>
        </router-link>
      </section>
    </main>

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
      routingUtilities(this).addParameters({}).goTo(RegisterRoute)
    },
    login: function() {
      routingUtilities(this).addParameters({}).goTo(LoginRoute)
    }
  }
}
