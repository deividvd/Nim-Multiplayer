const Home = {
  components: {
    'app-header': AppHeader,
    'user-section': UserSection,
    'how-to-play': HowToPlay
  },
  template:
  `
  <div>

    <app-header/>

    <user-section/>

    <main>
      <section>
        <router-link to="/create-game-room">
          <button type="button"> Create Game Room </button>
        </router-link>
      </section>
    </main>

    <how-to-play/>

    <footer>
      <router-link class="footer-link" to="/terms-of-service"> TERMS OF SERVICE </router-link>
      <hr/>
      <router-link class="footer-link" to="/privacy"> PRIVACY </router-link>
      <hr/>
      <a class="footer-link" href="https://www.facebook.com/" target="_blank"> Facebook </a>
      <hr/>
      <a class="footer-link" href="https://twitter.com/" target="_blank"> Twitter </a>
    </footer>

  </div>
  `,
  methods: {
    goToAccount: function() {
      twoPageRoutingFrom(this).addParameters({}).goTo(AccountRoute)
    },
    goToLogin: function() {
      twoPageRoutingFrom(this).addParameters({}).goTo(LoginRoute)
    },
    goToRegister: function() {
      twoPageRoutingFrom(this).addParameters({}).goTo(RegisterRoute)
    }
  }
}
