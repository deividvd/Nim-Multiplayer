const GameRoom = {
  components: {
    'app-header': AppHeader,
    'how-to-play': HowToPlay,
  },
  template:
  `
  <main>
    <div v-if="username">


    <!-- "play the game" section -->
  

    <section v-if="game.players && isUsernameInGame()">
      <h1> Time to play the game! </h1>

      <p class="information">
        Do <b>NOT REFRESH</b> the page, otherwise you will be <b>ELIMINATED </b> from the game.
      </p>

      <div id="game-information">
        <div class="information">
          <p>
            playing as 
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
            <li v-for="player in game.playersWithTurnDone">
              {{ player }}
            </li>
          </ul>
        </div>

        <button :disabled="usernameIsNotTheActivePlayer()"
                id="remove-sticks-btn" v-on:click="removeSelectedSticks" type="button"
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


    <section v-if="game && ! game.players">
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
    </section>


    </div> <!-- div v-if="username" -->


    <!-- "user is not logged in" or/and "game doesn't exist" or "user is not in this game" section -->


    <section v-if="! username || ! game || (game.players && ! isUsernameInGame() )">
      <app-header/>

      <p v-html="errorMessage" class="errorMessage"></p>
    </section>
    
  </main>
  `,
  data() {
    return {
      // "play the game" data:
      username: null, // the user logged in
      game: false,
      sticksWithMetadata: null,
      startGameMessage: 'start: ',
      // "invite players" data:
      gameSettingsMessage: '',
      maxPlayerNumber: 6,
      playersWaitingForGameStart: [],
      // data shared in both sections:
      errorMessage: '',
      socket: null,
    }
  },
  mounted() {
    const promiseSetUsername = sessionUtilities().promiseSetUsernameOf(this)
    const promiseSetGameSettings = promiseSetGameSettingsOf(this)
    Promise.all([promiseSetUsername, promiseSetGameSettings])
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
            vueComponent.startGameMessage = vueComponent.startGameMessage + game._id
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
      const usernameNotLoggedIn = '<b>ERROR</b>: you must log in to play a game.'
      const game = vueComponent.game
      const gameDoNotExistMessage = "<b>ERROR</b>: this game doesn't exist, you have to create a new one!"
      if (( ! username) && (! game)) {
        errorMessage = usernameNotLoggedIn.concat(' <br/> ' + gameDoNotExistMessage)
      } else if ( ! username) {
        errorMessage = usernameNotLoggedIn
      } else if ( ! game) {
        errorMessage = gameDoNotExistMessage
      } else if (game.players && ! vueComponent.isUsernameInGame()) {
        errorMessage = "<b>ERROR</b>: you're not in this game."
      }
      return errorMessage
    }
  },
  methods: {
    startGame: function(event) {
      event.preventDefault()
      this.errorMessage = gatherClientSideErrorsFrom(this)
      if (this.errorMessage === '') {
        this.socket.emit(this.startGameMessage, this.playersWaitingForGameStart)
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
    isUsernameInGame: function() {
      return (this.game.players.includes(this.username) ||
          this.game.playersWithTurnDone.includes(this.username) ||
          this.game.eliminatedPlayers.includes(this.username))
    },
    activePlayerEqualsTo: function(player) {
      return this.game.activePlayer === player
    },
    usernameIsNotTheActivePlayer: function() {
      return this.game.activePlayer !== this.username
    },
    updateSticksWithMetadata: function() {
      const newSticksWithMetadata = []
      let row = 0
      for (let stickRow of this.game.sticks) {
        const newStickRowWithMetadata = []
        let stickPosition = 0
        for (let removedStick of stickRow) {
          let stick = { removed: true }
          if ( ! removedStick) {
            stick = {
              row: row,
              position: stickPosition,
              removed: false,
              selected: false,
            }
          }
          newStickRowWithMetadata.push(stick)
          stickPosition++
        }
        newSticksWithMetadata.push(newStickRowWithMetadata)
        row++
      }
      this.sticksWithMetadata = newSticksWithMetadata
    },
    selectStick: function(stick) {
      stick.selected = ! stick.selected
    },
    removeSelectedSticks: function() {
      this.errorMessage = ''
      const selectedSticks = getSelectedSticksOf(this)
      this.errorMessage = gatherStickSelectionErrorsFrom(selectedSticks)
      if (this.errorMessage === '') {
        const move = {
          selectedSticks: selectedSticks,
          username: this.username,
        }
        this.socket.emit(this.game._id, move)
      }

      function getSelectedSticksOf(vueComponent) {
        const selectedSticks = []
        for (let stickRow of vueComponent.sticksWithMetadata) {
          for (let stick of stickRow) {
            if (stick.selected) {
              selectedSticks.push(stick)
            }
          }
        }
        return selectedSticks
      }

      function gatherStickSelectionErrorsFrom(selectedSticks) {
        if (selectedSticks.length === 0) {
          return 'You must select at least one stick!'
        }
        const orderedSelectedSticksByPosition = selectedSticks.sort(
          function (firstStick, secondStick) {
            if (firstStick.position < secondStick.position) {
              return -1;
            }
            if (firstStick.position > secondStick.position) {
              return 1;
            }
            return 0;
          }
        )
        let row = selectedSticks[0].row
        let position = selectedSticks[0].position
        let errorMessage = ''
        for (let stick of orderedSelectedSticksByPosition) {
          if (stick.row != row) {
            errorMessage = 'Removed sticks must be in the same row!'
          }
          if ( (stick.position - position) > 0) {
            errorMessage = 'Removed sticks must be adiacent!'
          }
          position++
        }
        return errorMessage
      }
    }
  }
}

function connectSocketIO(vueComponent) {
  const username = vueComponent.username
  const gameId = vueComponent.game._id
  const userJoinGameRoom = 'user join game room: ' + gameId
  const userUpdate = 'user update: ' + gameId
  const startGame = vueComponent.startGameMessage
  const connectionOptions = {
    query: {
      username: username,
      userJoinGameRoom: userJoinGameRoom,
      userUpdate: userUpdate,
      startGame: startGame,
      gameId: gameId,
    }
  }
  const socket = io(serverAddress, connectionOptions)
  receiveUserJoinGameRoom()
  receiveUserUpdate()
  receiveStartGame()
  receiveGameMove()
  // console.log('1 - emit: ' + userJoinGameRoom + ' : ' + username);
  socket.emit(userJoinGameRoom, username)
  vueComponent.socket = socket

  function receiveUserJoinGameRoom() {
    socket.on(userJoinGameRoom, function(username) {
      // console.log('1 - receive: ' + userJoinGameRoom + ' : ' + username);
      const user = { username: vueComponent.username }
      // console.log('2 - emit: ' + userUpdate + ' : ' + user.username);
      socket.emit(userUpdate, user)
    })
  }

  function receiveUserUpdate() {
    const playersWaitingForGameStart = vueComponent.playersWaitingForGameStart
    socket.on(userUpdate, function(user) {
      // console.log('2 - receive: ' + userUpdate + ' : ' + user.username + '; disconnected = ' + user.disconnected);
      const username = user.username
      if (user.disconnected) {
        // console.log('3 - ' + username + ': is disconnected' );
        const usernameIndex = playersWaitingForGameStart.indexOf(username);
        if (usernameIndex !== -1) {
          playersWaitingForGameStart.splice(usernameIndex, 1);
        }
      } else {
        if (playersWaitingForGameStart.includes(username)) {
          // console.log('2 - ' + username + ': is already on page');
        } else {
          // console.log('2 - ' + 'new username on page: ' + username);
          playersWaitingForGameStart.push(username)
        }
      }
    })
  }

  function receiveStartGame() {
    socket.on(startGame, function(game) {
      // console.log('4 - ' + startGame);
      vueComponent.errorMessage = ''
      updateVueComponentWith(game)
    })
  }

  function updateVueComponentWith(game) {
    vueComponent.game = game
    vueComponent.updateSticksWithMetadata()
    vueComponent.$forceUpdate()
  }

  function receiveGameMove() {
    socket.on(gameId, function(game) {
      console.log('5 - move received');
      // TODO win ???
      updateVueComponentWith(game)
    })
  }
}