const CreateGameRoom = {
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

    <login-section/>

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
    register: function() {
      RoutingUtilities(this).addParameters({}).goTo(RegisterRoute)
    },
    login: function() {
      RoutingUtilities(this).addParameters({}).goTo(LoginRoute)
    },
    createGameRoom: function(event) {
      event.preventDefault()
    }
  }
}