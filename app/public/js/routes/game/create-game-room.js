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
      <form>
        <label for="players"> Numero di Giocatori: </label>
        <select id="players">
          <option value="2"> 2 </option>
          <option value="3"> 3 </option>
          <option value="4"> 4 </option>
          <option value="5"> 5 </option>
          <option value="6"> 6 </option>
        </select>
        <br/>
        <label> Vittoria: </label>
        <br/>
        <input id="standard" name="victory" type="radio" value="standard" checked="checked" />
        <label for="standard"> Standard </label>
        <br/>
        <input id="marienbad" name="victory" type="radio" value="marienbad" />
        <label for="marienbad"> Marienbad </label>
        <br/>
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