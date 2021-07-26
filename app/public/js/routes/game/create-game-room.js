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

          <label for="rows"> Rows </label>
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
        
          <p v-html="errorMessage" class="errorMessage"></p>
          
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
      axios.get(serverAddress + 'get-user-logged-in')
        .then((response) => {
          if (response.data.username) {
            const invitePlayerRoomConfiguration = newInvitePlayerRoomConfiguration(this)
            axios.post(serverAddress + 'create-invite-player-room', invitePlayerRoomConfiguration)
              .then((response) => { goToInvitePlayerRoom(response.data.gameId) })
              .catch((error) => { this.errorMessage = error })
          } else {
            this.errorMessage = 'You must log in before create a game.'
          }
        })
        .catch((error) => { this.errorMessage = error })

      function newInvitePlayerRoomConfiguration(vueComponent) {
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

      function goToInvitePlayerRoom(gameId) {
        const nextPagePath = invitePlayersRoomPath + '/' + gameId
        router.push({ path: nextPagePath })
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