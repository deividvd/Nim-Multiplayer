const CreateGameRoom = {
  components: {
    'app-header': AppHeader,
    'go-back-button': GoBackButton,
    'user-section': UserSection,
    'how-to-play': HowToPlay
  },
  template:
  `
  <div>

    <app-header/>

    <go-back-button/>

    <user-section/>

    <section>
      <h2> Create your Game Room </h2>

      <form>
        <label for="players"> Numero di Giocatori: </label>
        <select id="players">
          <option value="2"> 2 </option>
          <option value="3"> 3 </option>
          <option value="4"> 4 </option>
          <option value="5"> 5 </option>
          <option value="6"> 6 </option>
        </select>

        <label for="victory"> Vittoria: </label>
        <select id="victory">
          <option value="2"> Standard </option>
          <option value="3"> Marienbad </option>
        </select>

        <label for="players"> Numero di Righe </label>
        <select id="players">
          <option value="2"> 2 </option>
          <option value="3"> 3 </option>
          <option value="4"> 4 </option>
          <option value="5"> 5 </option>
          <option value="6"> 6 </option>
        </select>
        
        <br/>
        <button v-on:click="createGameRoom"> CREATE GAME ROOM </button>
      </form>
    </section>

    <how-to-play/>

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
    },


    
    createGameRoom: function(event) {
      event.preventDefault()
    }
  }
}