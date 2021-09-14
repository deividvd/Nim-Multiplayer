const GameRoom = {
  components: {
    'app-header': AppHeader,
    'how-to-play': HowToPlay,
  },
  template:
  `
  <main>
    <div v-if="username">


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

        <p v-html="errorMessage" class="error-message"></p>

        <button type="submit" v-on:click="startGame"> Start Game! </button>
      </form>

      <how-to-play/>
    </section>


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

      <p v-html="errorMessage" class="error-message"></p>
        
      <div v-for="stickRow in sticksWithVisualData" class="stick-row">
        <button v-for="stick in stickRow"
                :disabled="stick.removed"
                v-bind:class="{ notSelectedStick: ! stick.selected, selectedStick: stick.selected }"
                class="stick" type="button" v-on:click="selectStick(stick)"
        >
          <img src="/static/img/single-element.png" alt="a stick" />
        </button>
      </div>
    </section>

    </div> <!-- v-if="username" -->


    <!-- error section -->


    <section v-if="! username || ! game || (game.players && ! isUsernameInGame() )">
      <app-header/>

      <p v-html="errorMessage" class="error-message"></p>
    </section>
    
  </main>
  `,
  data() {
    return {
      // data in "invite players" and "play the game" sections:
      username: null, // the user logged in
      socket: null,
      // data in "invite players" section:
      maxPlayerNumber: 6,
      gameSettingsMessage: '',
      playersWaitingForGameStart: [],
      startGameMessage: 'start: ',
      // data in "play the game" section:
      game: false,
      sticksWithVisualData: null,
      // data shared in all sections:
      errorMessage: '',
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
        console.log('[4] send ' + this.startGameMessage)
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
    updateSticksWithVisualData: function() {
      const newSticksWithVisualData = []
      let row = 0
      for (let stickRow of this.game.sticks) {
        const newStickRowWithVisualData = []
        let position = 0
        for (let removedStick of stickRow) {
          let stick = { removed: true }
          if ( ! removedStick) {
            stick = {
              row: row,
              position: position,
              removed: false,
              selected: false,
            }
          }
          newStickRowWithVisualData.push(stick)
          position++
        }
        newSticksWithVisualData.push(newStickRowWithVisualData)
        row++
      }
      this.sticksWithVisualData = newSticksWithVisualData
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
        console.log('[5] send game move')
        this.socket.emit(this.game._id, move)
      }

      function getSelectedSticksOf(vueComponent) {
        const selectedSticks = []
        for (let stickRow of vueComponent.sticksWithVisualData) {
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
              return -1
            }
            if (firstStick.position > secondStick.position) {
              return 1
            }
            return 0
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
  const playersWaiting = vueComponent.playersWaitingForGameStart
  const gameId = vueComponent.game._id
  const playerJoinsGame = 'join: ' + gameId
  const updatePlayersWaiting = 'update: ' + gameId
  const disconnectPlayerWaiting = 'disconnection: ' + gameId
  const startGame = vueComponent.startGameMessage
  const connectionOptions = {
    query: {
      username: username,
      playerJoinsGame: playerJoinsGame,
      updatePlayersWaiting: updatePlayersWaiting,
      disconnectPlayerWaiting: disconnectPlayerWaiting,
      startGame: startGame,
      gameId: gameId,
    }
  }
  const socket = io(serverAddress, connectionOptions)
  receivePlayerJoinsGameAndSendUpdatePlayersWaiting()
  receiveUpdatePlayersWaiting()
  receiveDisconnectPlayerWaiting()
  receiveStartGame()
  receiveGameMove()
  vueComponent.socket = socket
  console.log('[1] send ' + playerJoinsGame)
  socket.emit(playerJoinsGame)

  function receivePlayerJoinsGameAndSendUpdatePlayersWaiting() {
    socket.on(playerJoinsGame, function() {
      console.log('[1] receive ' + playerJoinsGame)
      console.log('[2] send ' + updatePlayersWaiting)
      socket.emit(updatePlayersWaiting, username)
    })
  }

  function receiveUpdatePlayersWaiting() {
    socket.on(updatePlayersWaiting, function(username) {
      console.log('[2] receive ' + updatePlayersWaiting)
      if (playersWaiting) {
        if (playersWaiting.includes(username)) {
          console.log('[2] receive ' + username + " but this user is already in game room")
        } else {
          console.log('[2] receive ' + username + ' and add it in game room')
          playersWaiting.push(username)
        }
      } else {
        console.log('[2] receive ' + username + ' but the game is already started')
      }
    })
  }

  function receiveDisconnectPlayerWaiting() {
    socket.on(disconnectPlayerWaiting, function(username) {
      console.log('[3] receive ' + disconnectPlayerWaiting)
      if (playersWaiting) {
        if (playersWaiting.includes(username)) {
          console.log('[3] receive ' + username + ' and remove it from game room')
          const usernameIndex = playersWaiting.indexOf(username)
          if (usernameIndex > -1) {
            playersWaiting.splice(usernameIndex, 1)
          }
        } else {
          console.log('[3] receive ' + username + " but this user is not in game room")
        }
      } else {
        console.log('[3] receive ' + username + ' but the game is already started')
      }
    })
  }

  function receiveStartGame() {
    socket.on(startGame, function(game) {
      console.log('[4] receive ' + startGame)
      vueComponent.errorMessage = ''
      vueComponent.playersWaitingForGameStart = false
      updateVueComponentWith(game)
    })
  }

  function updateVueComponentWith(game) {
    vueComponent.game = game
    vueComponent.updateSticksWithVisualData()
    vueComponent.$forceUpdate()
  }

  function receiveGameMove() {
    socket.on(gameId, function(game) {
      console.log('[5] receive game move')
      if (game.winner) {
        router.push({
          name: GameEndRoute.name,
          params: {
            winner: game.winner,
            losers: game.losers
          }
        })
      } else {
        updateVueComponentWith(game)
      }
    })
  }
}