const GameRoom = {
  components: {
    'app-header': AppHeader,
    'how-to-play': HowToPlay,
  },
  template:
  `
  <main>
  <section>
    <div v-if="username && gameId">
      <div v-if="gameStarted">
        <h1> Time to play the game! </h1>

        <p class="errorMessage">
          Do <b>NOT REFRESH</b> the page or you will be <b>ELIMINATED </b> from the game.
        </p>

        <p class="errorMessage" v-html="errorMessage"></p>
        
        <div v-for="stickRow in sticks" class="stick-line">
          <button v-for="stick in stickRow" v-on:click="selectStick(stick)" :disabled="stick.removed" class="stick" type="button">
            <img src="/static/img/single-element.png" alt="a stick" />
          </button>
        </div>
      </div>

      <div v-else>
        <h1> Invite other Players! </h1>

        <p> Copy and link the URL of this page to invite other players! </p>

        <form>
          <p v-html="gameSettingsMessage"></p>

          <p> Players (Max Number {{ maxPlayerNumber }}): </p>
          
          <ol>
            <li v-for="player in players">
              {{ player }}
            </li>
          </ol>

          <p v-html="errorMessage" class="errorMessage"></p>

          <button v-on:click="startGame" type="submit"> Start Game! </button>
        </form>

        <how-to-play/>
      </div>
    </div>

    <div v-else>
      <app-header/>

      <p v-html="errorMessage" class="errorMessage"></p>
    </div>
  </section>
  </main>
  `,
  data() {
    return {
      username: null,
      gameId: null,
      gameSettingsMessage: '',
      gameStarted: false,
      maxPlayerNumber: 6,
      players: [],
      sticks: null,
      errorMessage: '',
      socket: null,
    }
  },
  mounted() {
    const promiseSetUsername = sessionUtilities().promiseSetUsernameOf(this)
    const gameId = getGameIdFromPathOf(this)
    const promiseSetGameExist = promiseSetGameSettingsOf(this)
    Promise.all([promiseSetUsername, promiseSetGameExist])
      .then((results) => {
        applyNotLoggedInErrorMessageOn(this)
        if (this.errorMessage === '') {
          connectSocketIO(this)
        }
      })
      .catch((error) => { this.errorMessage = error })
    
    function getGameIdFromPathOf(vueComponent) {
      const currentPath = vueComponent.$route.path
      const resourcesArray = currentPath.split('/')
      return resourcesArray[ resourcesArray.length - 1 ]
    }

    function promiseSetGameSettingsOf(vueComponent) {
      const gameIdObject = { gameId: gameId }
      return axios.post(serverAddress + 'get-game-by-id', gameIdObject)
        .then((response) => {
          responseResolverOf(vueComponent).addSuccessBehavior(successOf).resolve(response)

          function successOf(vueComponent) {
            const game = response.data.game
            vueComponent.gameId = game._id
            vueComponent.gameSettingsMessage = newGameSettingsMessage(game)
            vueComponent.sticks = game.sticks

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
              return gameSettingsMessage
            }
          }
        })
        .catch((error) => { vueComponent.errorMessage = error })
    }

    function applyNotLoggedInErrorMessageOn(vueComponent) {
      const youMustLogInMessage = '<b>ERROR</b>: you must log in to play.'
      if ((! vueComponent.gameId) && (! vueComponent.username)) {
        vueComponent.errorMessage = vueComponent.errorMessage.concat(' <br/> ' + youMustLogInMessage)
      } else if (! vueComponent.username) {
        vueComponent.errorMessage = youMustLogInMessage
      }
    }

    function connectSocketIO(vueComponent) {
      const username = vueComponent.username
      const gameId = vueComponent.gameId
      const notify = gameId + '- notify user'
      const update = gameId + '- update user'
      const connectionOptions = {
        query: {
          username: username,
          notify: notify,
          update: update,
          gameId: gameId,
        }
      }
      const socket = io(serverAddress, connectionOptions)
      setupStartGameReceptionOf(vueComponent)
      setupUpdateReceptionOf(vueComponent)
      setupNotifyReceptionOf(vueComponent)
      emitNotify()
      vueComponent.socket = socket

      function emitNotify() {
        socket.emit(notify, username)
        // console.log('1 - notify sent: ' + username);
      }

      function setupNotifyReceptionOf(vueComponent) {
        socket.on(notify, function(username) {
          // console.log('2 - notify received: ' + username);
          const user = { username: vueComponent.username }
          socket.emit(update, user)
          // console.log('2 - update sent: ' + user.username);
        })
      }

      function setupUpdateReceptionOf(vueComponent) {
        const players = vueComponent.players
        socket.on(update, function(user) {
          // console.log('3 - update received: ' + user.username + '; disconnected = ' + user.disconnected);
          const username = user.username
          if (! user.disconnected) {
            if (players.includes(username)) {
              // console.log('4 - ' + username + ': is already on page');
            } else {
              // console.log('4 - ' + 'new username on page: ' + username);
              players.push(username)
            }
          } else {
            // console.log('5 - ' + username + ': is disconnected' );
            const usernameIndex = players.indexOf(username);
            if (usernameIndex !== -1) {
              players.splice(usernameIndex, 1);
            }
          }
        })
      }

      function setupStartGameReceptionOf(vueComponent) {
        const gameId = vueComponent.gameId
        socket.on(gameId, function() {
          console.log(vueComponent.socket);
          // qui c'era router push
        })
      }
    }
  },
  methods: {
    startGame: function(event) {
      event.preventDefault()
      const youCantPlayAloneMessage = "You can't play alone."
      const maximumPlayerNumberMessage = 'The maximum number of players is 6.'
      clearAmmisibleExceptionOf(this)
      axios.get(getUserLoggedInPath)
        .then((response) => {
          if (response.data.username) {
            if (this.players.length <= 1) {
              this.errorMessage = youCantPlayAloneMessage
            } else if (this.players.length > this.maxPlayerNumber) {
              this.errorMessage = maximumPlayerNumberMessage
            } else {
              const gameIdAndPlayers = { 
                gameId: this.gameId,
                players: this.players,
              }
              axios.post(serverAddress + 'update-invite-player-room-to-game-room', gameIdAndPlayers)
                .then((response) => { this.socket.emit(this.gameId)})
                .catch((error) => { this.errorMessage = error })
            }
          } else {
            this.errorMessage = 'You must log in before create a game.'
          }
        })
        .catch((error) => { this.errorMessage = error })

      function clearAmmisibleExceptionOf(vueComponent) {
        if (vueComponent.errorMessage === youCantPlayAloneMessage ||
            vueComponent.errorMessage === maximumPlayerNumberMessage) {
          this.errorMessage === ''
        }
      }
    },

    selectStick: function(stick) {
      console.log("row:" + stick.row + "-number:" + stick.number + "-value:" + stick.value);
      stick.removed = true
      console.log(this.username);
    }
  }
}