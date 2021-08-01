const GameRoom = {
  components: {
    'app-header': AppHeader,
    'how-to-play': HowToPlay,
  },
  template:
  `
  <main>
  <section>
    <div v-if="username && game">


      <!-- "play the game" page -->


      <div v-if="game.players">
        <h1> Time to play the game! </h1>

        <p class="errorMessage">
          Do <b>NOT REFRESH</b> the page, otherwise you will be <b>ELIMINATED </b> from the game.
        </p>

        <p class="errorMessage" v-html="errorMessage"></p>
        
        <div v-for="stickRow in game.sticks" class="stick-line">
          <button v-for="stick in stickRow" v-on:click="selectStick(stick)" :disabled="stick.removed" class="stick" type="button">
            <img src="/static/img/single-element.png" alt="a stick" />
          </button>
        </div>
      </div>


      <!-- "invite players" page -->


      <div v-else>
        <h1> Invite other Players! </h1>

        <p> Copy and link the URL of this page to invite other players! </p>

        <form>
          <p v-html="gameSettingsMessage"></p>

          <label> Players (Max Number {{ maxPlayerNumber }}): </label>
          
          <ol>
            <li v-for="player in waitingPlayers">
              {{ player }}
            </li>
          </ol>

          <p v-html="errorMessage" class="errorMessage"></p>

          <button v-on:click="startGame" type="submit"> Start Game! </button>
        </form>

        <how-to-play/>
      </div>
    </div>


    <!-- "game doesn't exist" or/and "user is not logged in" page-->


    <div v-else>
      <app-header/>

      <p v-html="errorMessage" class="errorMessage"></p>
    </div>
    
  </section>
  </main>
  `,
  data() {
    return {
      // "play the game" data:
      username: null,
      game: null,
      // "invite players" data:
      gameSettingsMessage: '',
      maxPlayerNumber: 6,
      waitingPlayers: [],
      // data shared in all pages:
      errorMessage: '',
      socket: null,
    }
  },
  mounted() {
    const promiseSetUsername = sessionUtilities().promiseSetUsernameOf(this)
    const promiseSetGame = promiseSetGameSettingsOf(this)
    Promise.all([promiseSetUsername, promiseSetGame])
      .then((results) => {
        this.errorMessage = gatherServerSideErrorsFrom(this)
        if (this.errorMessage === '') {
          connectSocketIO(this)
        }
      })
      .catch((error) => { this.errorMessage = error })
    
    function promiseSetGameSettingsOf(vueComponent) {
      const gameIdObject = { gameId: getGameIdFromPathOf(vueComponent) }
      return axios.post(serverAddress + 'get-game-by-id', gameIdObject)
        .then((response) => {
          const game = response.data.game
          if (game) {
            vueComponent.game = game
            vueComponent.gameSettingsMessage = newGameSettingsMessage(game)
          }
        })
        .catch((error) => { vueComponent.errorMessage = error })

      function getGameIdFromPathOf(vueComponent) {
        const currentPath = vueComponent.$route.path
        const resourcesArray = currentPath.split('/')
        return resourcesArray[ resourcesArray.length - 1 ]
      }

      function newGameSettingsMessage(game) {
        var gameSettingsMessage = '<b>Game Settings</b> <br/> Victory Mode: '
        if (game.standardVictory) {
          gameSettingsMessage = gameSettingsMessage.concat('Standard')
        } else {
          gameSettingsMessage = gameSettingsMessage.concat('Marienbad')
        }
        gameSettingsMessage = gameSettingsMessage.concat('<br/> Turns: ')
        if (game.turnRotation) {
          gameSettingsMessage = gameSettingsMessage.concat('Rotation')
        } else {
          gameSettingsMessage = gameSettingsMessage.concat('Chaos')
        }
        gameSettingsMessage = gameSettingsMessage.concat('<br/> Stick Rows: ' + game.sticks.length)
        return gameSettingsMessage
      }
    }

    function gatherServerSideErrorsFrom(vueComponent) {
      var errorMessage = ''
      const username = vueComponent.username
      const usernameDoNotExistsMessage = '<b>ERROR</b>: you must log in to play.'
      const game = vueComponent.game
      const gameDoNotExistMessage = "<b>ERROR</b>: this game doesn't exist, you have to create a new one!"
      if (( ! username) && ( ! game)) {
        errorMessage = usernameDoNotExistsMessage.concat(' <br/> ' + gameDoNotExistMessage)
      } else if ( ! username) {
        errorMessage = usernameDoNotExistsMessage
      } else if ( ! game) {
        errorMessage = gameDoNotExistMessage
      }
      return errorMessage
    }
  },
  methods: {
    startGame: function(event) {
      event.preventDefault()
      this.errorMessage = gatherClientSideErrorsFrom(this)
      if (this.errorMessage === '') {
        const gameId = this.game._id
        const waitingPlayers = this.waitingPlayers
        const gameIdAndWaitingPlayers = { 
          gameId: gameId,
          waitingPlayers: waitingPlayers,
        }
        axios.post(serverAddress + 'update-game-with-players', gameIdAndWaitingPlayers)
          .then((response) => { this.socket.emit(gameId) })
          .catch((error) => { this.errorMessage = error })
      }
      
      function gatherClientSideErrorsFrom(vueComponent) {
        const waitingPlayers = vueComponent.waitingPlayers
        if (waitingPlayers.length <= 1) {
          return "You can't play alone."
        }
        const maxPlayerNumber = vueComponent.maxPlayerNumber
        if (waitingPlayers.length > maxPlayerNumber) {
          return 'The maximum number of players is ' + maxPlayerNumber + '.'
        }
        return ''
      }
    },
    selectStick: function(stick) {
      console.log("row:" + stick.row + "-number:" + stick.number + "-value:" + stick.value);
      stick.removed = true
      console.log(this.username);
    }
  }
}

function connectSocketIO(vueComponent) {
  const username = vueComponent.username
  const gameId = vueComponent.game._id
  const userJoinGameRoom = 'user join game room: ' + gameId
  const userUpdate = 'update user: ' + gameId
  const connectionOptions = {
    query: {
      username: username,
      userJoinGameRoom: userJoinGameRoom,
      userUpdate: userUpdate,
      gameUpdate: gameId,
    }
  }
  const socket = io(serverAddress, connectionOptions)
  receiveGameUpdate()
  receiveUserUpdate()
  receiveUserJoinGameRoom()
  emitUserJoinGameRoom()
  vueComponent.socket = socket

  function emitUserJoinGameRoom() {
    // console.log('1 - emit: ' + userJoinGameRoom + ' : ' + username);
    socket.emit(userJoinGameRoom, username)
  }

  function receiveUserJoinGameRoom() {
    socket.on(userJoinGameRoom, function(username) {
      // console.log('2 - receive: ' + userJoinGameRoom + ' : ' + username);
      const user = { username: vueComponent.username }
      // console.log('2 - emit: ' + userUpdate + ' : ' + user.username);
      socket.emit(userUpdate, user)
    })
  }

  /**
   * This function updates only the "vueComponent.waitingPlayers",
   * so it's change only 
   * */
  function receiveUserUpdate() {
    const waitingPlayers = vueComponent.waitingPlayers
    socket.on(userUpdate, function(user) {
      // console.log('3 - receive: ' + userUpdate + ' : ' + user.username + '; disconnected = ' + user.disconnected);
      const username = user.username
      if (user.disconnected) {
        // console.log('5 - ' + username + ': is disconnected' );
        const usernameIndex = waitingPlayers.indexOf(username);
        if (usernameIndex !== -1) {
          waitingPlayers.splice(usernameIndex, 1);
        }
      } else {
        if (waitingPlayers.includes(username)) {
          // console.log('4 - ' + username + ': is already on page');
        } else {
          // console.log('4 - ' + 'new username on page: ' + username);
          waitingPlayers.push(username)
        }
      }
    })
  }

  function receiveGameUpdate() {
    socket.on(gameId, function() {
      // console.log('6 - game update: ' + gameId);
      pullTheGameAndRefreshVue()

      function pullTheGameAndRefreshVue() {
        const gameIdObject = { gameId: vueComponent.game._id }
        axios.post(serverAddress + 'get-game-by-id', gameIdObject)
          .then((response) => {
            vueComponent.game = response.data.game
            vueComponent.$forceUpdate()
          })
          .catch((error) => { vueComponent.errorMessage = error })
      }
    })
  }
}