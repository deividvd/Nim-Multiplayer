const GameRoom = {
  template:
  `
  <main>
    <section>
      <h1> Time to play the game! </h1>

      <p class="errorMessage"> Do <b>NOT REFRESH</b> the page or you will be <b>ELIMINATED</b> from the game. </p>

      <p v-html="errorMessage" class="errorMessage"></p>
        
      <div v-for="stickRow in sticks" class="stick-line">
        <button v-for="stick in stickRow" v-on:click="selectStick(stick)" :disabled="stick.removed" class="stick" type="button">
          <img src="/static/img/single-element.png" alt="a stick" />
        </button>
      </div>

    </section>
  </main>
  `,
  data() {
    return {
      username: null,
      gameId: null,
      errorMessage: '',
      sticks: null
    }
  },
  mounted() {
    sessionUtilities().goHomeIfUserIsLoggedOut(this)
    sessionUtilities().setUsernameOf(this)
    const currentPath = this.$route.path // "$route" works only with "this." and not with the "vueComponent."
    const resourcesArray = currentPath.split('/')
    this.gameId = resourcesArray[ resourcesArray.length - 1 ]
    initializeSticksOf(this)

    // socket.io

    function initializeSticksOf(vueComponent) {
      axios.post(serverAddress + 'get-game-by-id', { gameId: vueComponent.gameId })
        .then((response) => { 
          const stickValues = response.data.game.sticks
          const sticks = []
          let row = 1
          for (let stickRowValues of stickValues) {
            const stickRow = []
            let stickNumber = 1
            for (let stickValue of stickRowValues) {
              const stick = {
                row: row,
                number: stickNumber,
                value: stickValue,
                selected: false,
                removed: false
              }
              stickRow.push(stick)
              stickNumber++
            }
            sticks.push(stickRow)
            row++
          }
          vueComponent.sticks = sticks
        })
        .catch((error) => { this.errorMessage = error })
    }
  },
  methods: {
    selectStick: function(stick) {
      console.log("row:" + stick.row + "-number:" + stick.number + "-value:" + stick.value);
      stick.removed = true
      console.log(this.username);
    }
  }
}