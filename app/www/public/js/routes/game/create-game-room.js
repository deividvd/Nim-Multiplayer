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

    <main>
      <section>
        <h2> Create your Game Room </h2>

        <form>
          <label for="victory"> Victory Mode </label>
          <select id="victory" v-model="victory">
            <option value="Standard"> Standard </option>
            <option value="Marienbad"> Marienbad </option>
          </select>

          <label for="turns"> Turns </label>
          <select id="turns" v-model="turns">
            <option value="Rotation"> Rotation </option>
            <option value="Chaos"> Chaos </option>
          </select>

          <label for="rows"> Stick Rows </label>
          <select id="rows" v-model="rows">
            <option value="4"> 4 </option>
            <option value="5"> 5 </option>
            <option value="6"> 6 </option>
            <option value="7"> 7 </option>
            <option value="8"> 8 </option>
            <option value="9"> 9 </option>
            <option value="10"> 10 </option>
            <option value="11"> 11 </option>
            <option value="12"> 12 </option>
            <option value="13"> 13 </option>
            <option value="14"> 14 </option>
            <option value="15"> 15 </option>
          </select>
        
          <p v-html="errorMessage" class="error-message"></p>
          
          <button v-on:click="createGameRoom" type="submit"> CREATE GAME ROOM </button>
        </form>
      </section>
    </main>

    <how-to-play/>

  </div>
  `,
  data() {
    return {
      victory: 'Standard',
      turns: 'Rotation',
      rows: 4,
      errorMessage: '',
    }
  },
  methods: {
    createGameRoom: function(event) {
      event.preventDefault()
      axios.get(getUserLoggedInPath)
        .then((response) => {
          this.errorMessage = gatherServerSideErrorsFrom(response)
          if (this.errorMessage === '') {
            const gameConfiguration = newGameConfigurationFrom(this)
            axios.post(serverAddress + 'create-game', gameConfiguration)
              .then((response) => { goToGameRoom(response.data.gameId) })
              .catch((error) => { this.errorMessage = error })
          }
        })
        .catch((error) => { this.errorMessage = error })

      function gatherServerSideErrorsFrom(response) {
        if ( ! response.data.username) {
          return 'You must log in before create a game.'
        }
        return ''
      }

      function newGameConfigurationFrom(vueComponent) {
        const standardVictory = isStandardVictoryOn(vueComponent.victory)
        const turnRotation = isTurnRotationOn(vueComponent.turns)
        return {
          standardVictory: standardVictory,
          turnRotation: turnRotation,
          rows: vueComponent.rows,
        }

        function isStandardVictoryOn(victory) {
          if (victory === 'Standard') {
            return true
          }
          return false
        }

        function isTurnRotationOn(turns) {
          if (turns === 'Rotation') {
            return true
          }
          return false
        }
      }

      function goToGameRoom(gameId) {
        const newGameRoomPath = gameRoomPath + '/' + gameId
        router.push({ path: newGameRoomPath })
      }
    },
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