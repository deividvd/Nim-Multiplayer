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
          <p v-html="errorMessage"></p>

          <label for="players"> Players </label>
          <select id="players" v-model="players">
            <option value="2"> 2 </option>
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
            <option value="5"> 5 </option>
            <option value="6"> 6 </option>
          </select>

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
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
            <option value="5"> 5 </option>
            <option value="6"> 6 </option>
            <option value="7"> 7 </option>
            <option value="8"> 8 </option>
          </select>
        
          <br/>
          <button v-on:click="createGameRoom" type="submit"> CREATE GAME ROOM </button>
        </form>
      </section>
    </main>

    <how-to-play/>

  </div>
  `,
  data() {
    return {
      errorMessage: '',
      players: 2,
      victory: 'Standard',
      turns: 'Rotation',
      rows: 3,
    }
  },
  methods: {
    createGameRoom: function(event) {
      event.preventDefault()
      const standardVictory = isStandardVictoryOn(this.victory)
      const turnRotation = isTurnRotationOn(this.turns)
      const gameConfiguration = {
        players: this.players,
        standardVictory: standardVictory,
        turnRotation: turnRotation,
        rows: this.rows,
      }
      axios.post(serverAddress + 'create-game-room', gameConfiguration)
        .then((response) => {
          const gameId = response.data.gameId
          const newGameRoomPath = gameRoomPath + '/' + gameId
          router.push({ path: newGameRoomPath })
        })
        .catch((error) => { this.errorMessage = error })

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
  }
}