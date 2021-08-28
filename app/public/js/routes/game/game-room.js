const GameRoom = {
  components: {
    'app-header': AppHeader,
    'how-to-play': HowToPlay,
  },
  template:
  `
  <main>
    <div v-if="username && game">


      <!-- "play the game" section -->


      <section v-if="game.players">
        <h1> Time to play the game! </h1>

        <p class="information">
            Do <b>NOT REFRESH</b> the page, otherwise you will be <b>ELIMINATED </b> from the game.
        </p>

        <div id="game-information">
          <div v-if="isUsernameInPlayers()" class="information">
            <p>
              playing as 
              <br/>
              {{ username }}
            </p>
          </div>
          <div v-else class="information">
            <p>
              watching as
              <br/>
              {{ username }}
            </p>
          </div>

          <div class="information">
            <label> Player List: </label>
            <ul>
              <li v-for="player in game.players"
                  v-bind:class="{ activePlayer: activePlayerEqualsTo(player) }"
              >
                {{ player }}
              </li>
            </ul>
          </div>

          <button v-if="isUsernameInPlayers()"
                  :disabled="usernameIsNotTheActivePlayer()"
                  id="remove-sticks-btn" v-on:click="removeSelectedSticks()"
          >
            REMOVE STICKS
          </button>
        </div>

        <p class="errorMessage" v-html="errorMessage"></p>
        
        <div v-for="stickRow in sticksWithMetadata" class="stick-row">
          <button v-for="stick in stickRow"
                  :disabled="stick.removed"
                  v-bind:class="{ activeStick: ! stick.selected, selectedStick: stick.selected }"
                  class="stick" type="button" v-on:click="selectStick(stick)"
          >
            <img src="/static/img/single-element.png" alt="a stick" />
          </button>
        </div>
      </section>


      <!-- "invite players" section -->


      <section v-else>
        <h1> Invite other Players! </h1>

        <p> Copy and link the URL of this page to invite other players! </p>

        <form>
          <p v-html="gameSettingsMessage"></p>

          <label> Players (Max Number {{ maxPlayerNumber }}): </label>
          
          <ol>
            <li v-for="player in playersWaitingForGameStart">
              {{ player }}
            </li>
          </ol>

          <p v-html="errorMessage" class="errorMessage"></p>

          <button type="submit" v-on:click="startGame"> Start Game! </button>
        </form>

        <how-to-play/>
      </div>
    </section>


    <!-- "game doesn't exist" or/and "user is not logged in" section -->


    <section v-else>
      <app-header/>

      <p v-html="errorMessage" class="errorMessage"></p>
    </section>
    
  </main>
  `,
  data() {
    return {
      // "play the game" data:
      username: null, // the user logged in
      game: null,
      sticksWithMetadata: [[], []],
      // "invite players" data:
      gameSettingsMessage: '',
      maxPlayerNumber: 6,
      playersWaitingForGameStart: [],
      startGameMessage: 'start game: ',
      // data shared in both sections:
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
      const usernameDoNotExistsMessage = '<b>ERROR</b>: you must log in to play or watch a game.'
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
        const playersWaitingForGameStart = this.playersWaitingForGameStart
        const gameIdAndPlayers = { 
          gameId: gameId,
          playersWaitingForGameStart: playersWaitingForGameStart,
        }
        axios.post(serverAddress + 'update-game-with-players', gameIdAndPlayers)
          .then((response) => { this.socket.emit(this.startGameMessage + gameId) })
          .catch((error) => { this.errorMessage = error })
      }
      
      function gatherClientSideErrorsFrom(vueComponent) {
        const playersWaitingForGameStart = vueComponent.playersWaitingForGameStart
        if (playersWaitingForGameStart.length <= 1) {
          return "You can't play alone."
        }
        const maxPlayerNumber = vueComponent.maxPlayerNumber
        if (playersWaitingForGameStart.length > maxPlayerNumber) {
          return 'The maximum number of players is ' + maxPlayerNumber + '.'
        }
        return ''
      }
    },
    isUsernameInPlayers: function() {
      return this.game.players.includes(this.username)
    },
    activePlayerEqualsTo: function(player) {
      return this.game.activePlayer === player
    },
    usernameIsNotTheActivePlayer: function() {
      return this.game.activePlayer !== this.username
    },
    updateSticksWithMetadata: function() {
      const sticksWithMetadata = []
      let row = 1
      for (let stickRow of this.game.sticks) {
        const stickRowWithMetadata = []
        let stickNumber = 1
        for (let stickValue of stickRow) {
          let stick
          if (stickValue) {
            stick = {
              row: row,
              number: stickNumber,
              value: stickValue,
              selected: false,
              removed: false
            }
          } else {
            stick = {
              removed: true
            }
          }
          stickRowWithMetadata.push(stick)
          stickNumber++
        }
        sticksWithMetadata.push(stickRowWithMetadata)
        row++
      }
      this.sticksWithMetadata = sticksWithMetadata
      console.log(this.sticksWithMetadata);
    },
    selectStick: function(stick) {
      console.log("row:" + stick.row + "-number:" + stick.number + "-value:" + stick.value);
      stick.selected = ! stick.selected
      console.log(this.username);
    },
    removeSelectedSticks: function() {

    }
  }
}

function connectSocketIO(vueComponent) {
  const username = vueComponent.username
  const gameId = vueComponent.game._id
  const userJoinGameRoom = 'user join game room: ' + gameId
  const userUpdate = 'user update: ' + gameId
  const startGame = vueComponent.startGameMessage + gameId
  const connectionOptions = {
    query: {
      username: username,
      userJoinGameRoom: userJoinGameRoom,
      userUpdate: userUpdate,
      startGame: startGame,
      gameUpdate: gameId,
    }
  }
  const socket = io(serverAddress, connectionOptions)
  receiveUserJoinGameRoom()
  receiveUserUpdate()
  receiveStartGame()
  receiveGameUpdate()
  // console.log('1 - emit: ' + userJoinGameRoom + ' : ' + username);
  socket.emit(userJoinGameRoom, username)
  vueComponent.socket = socket

  function receiveUserJoinGameRoom() {
    socket.on(userJoinGameRoom, function(username) {
      // console.log('2 - receive: ' + userJoinGameRoom + ' : ' + username);
      const user = { username: vueComponent.username }
      // console.log('2 - emit: ' + userUpdate + ' : ' + user.username);
      socket.emit(userUpdate, user)
    })
  }

  function receiveUserUpdate() {
    const playersWaitingForGameStart = vueComponent.playersWaitingForGameStart
    socket.on(userUpdate, function(user) {
      // console.log('3 - receive: ' + userUpdate + ' : ' + user.username + '; disconnected = ' + user.disconnected);
      const username = user.username
      if (user.disconnected) {
        // console.log('5 - ' + username + ': is disconnected' );
        const usernameIndex = playersWaitingForGameStart.indexOf(username);
        if (usernameIndex !== -1) {
          playersWaitingForGameStart.splice(usernameIndex, 1);
        }
      } else {
        if (playersWaitingForGameStart.includes(username)) {
          // console.log('4 - ' + username + ': is already on page');
        } else {
          // console.log('4 - ' + 'new username on page: ' + username);
          playersWaitingForGameStart.push(username)
        }
      }
    })
  }

  function receiveStartGame() {
    socket.on(startGame, function() {
      // console.log('6 - ' + startGame);
      vueComponent.errorMessage = ''
      pullTheGameAndRefreshVue()
    })
  }

  function pullTheGameAndRefreshVue() {
    const gameIdObject = { gameId: vueComponent.game._id }
    axios.post(serverAddress + 'get-game-by-id', gameIdObject)
      .then((response) => {
        vueComponent.game = response.data.game
        vueComponent.updateSticksWithMetadata()
        vueComponent.$forceUpdate()
      })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function receiveGameUpdate() {
    socket.on(gameId, function() {
      // console.log('7 - game update: ' + gameId);
      pullTheGameAndRefreshVue()
    })
  }
}