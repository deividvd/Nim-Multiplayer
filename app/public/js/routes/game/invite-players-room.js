const InvitePlayersRoom = {
  components: {
    'app-header': AppHeader,
  },
  template:
  `
  <div>
    <main>
      <section>
        <div v-if="gameExists && username">
          <h1> Invite other Players! </h1>

          <p> Copy and link the URL of this page to invite other players! </p>

          <form>
            <p> Players (Max Number {{ maxPlayerNumber }}): </p>
          
            <ol>
              <li v-for="player in players">
                {{ player }}
              </li>
            </ol>

            <button v-on:click="startGame" type="submit"> Start Game! </button>
          </form>
        </div>
        <div v-else>
          <app-header/>

          <p v-html="errorMessage" class="errorMessage"></p>
        </div>
      </section>
    </main>
  </div>
  `,
  data() {
    return {
      gameExists: false,
      username: null,
      maxPlayerNumber: 6,
      players: [],
      errorMessage: '',
      gameId: null,
      socket: null,
    }
  },
  mounted() {
    setGameIdOf(this)
    const promiseSetGameExist = promiseSetGameExistsOf(this)
    const promiseSetUsername = sessionUtilities().promiseSetUsernameOf(this)
    Promise.all([promiseSetGameExist, promiseSetUsername])
      .then((results) => {
        createAndSetErrorMessageOf(this) 
        if (this.errorMessage === '') {
          connectSocketIO(this)
        }
      })
      .catch((error) => { this.errorMessage = error })

    function setGameIdOf(vueComponent) {
      const currentPath = vueComponent.$route.path
      const resourcesArray = currentPath.split('/')
      vueComponent.gameId = resourcesArray[ resourcesArray.length - 1 ]
    }

    function promiseSetGameExistsOf(vueComponent) {
      const gameIdObject = { gameId: vueComponent.gameId }
      return axios.post(serverAddress + 'get-game-by-id', gameIdObject)
        .then((response) => {
          if (response.data.game) {
            vueComponent.gameExists = true
          } else {
            vueComponent.gameExists = false
          }
        })
        .catch((error) => { vueComponent.errorMessage = error })
    }

    function createAndSetErrorMessageOf(vueComponent) {
      var exceptionMessage = ''
      if (! vueComponent.gameExists) {
        exceptionMessage = "<b>ERROR</b>: the game doesn't exist."
      }
      const youMustLogInMessage = '<b>ERROR</b>: you must log in to play.'
      if ((! vueComponent.gameExists) && (! vueComponent.username)) {
        exceptionMessage = exceptionMessage.concat(' <br/> ' + youMustLogInMessage)
      } else if (! vueComponent.username) {
        exceptionMessage = youMustLogInMessage
      }
      vueComponent.errorMessage = exceptionMessage
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
        console.log('notify sent: ' + username);
      }

      function setupNotifyReceptionOf(vueComponent) {
        socket.on(notify, function(username) {
          console.log('notify received: ' + username);
          const user = { username: vueComponent.username }
          socket.emit(update, user)
          console.log('   ' + 'update sent: ' + user);
        })
      }

      function setupUpdateReceptionOf(vueComponent) {
        const players = vueComponent.players
        socket.on(update, function(user) {
          console.log('update received: ' + user);
          const username = user.username
          const disconnected = user.disconnected
          if (! disconnected) {
            if (players.includes(username)) {
              console.log('   ' + username + ": is already on page");
            } else {
              console.log('   ' + "new username on page: " + username);
              players.push(username)
            }
          } else {
            console.log('   ' + username + ": is disconnected" );
            const usernameIndex = players.indexOf(username);
            if (usernameIndex !== -1) {
              players.splice(usernameIndex, 1);
            }
          }
        })
      }

      function setupStartGameReceptionOf(vueComponent) {
        socket.on(vueComponent.gameId, function() {
          // router push
          // mettere come post la "this.socket"
        })
      }
    }
  },
  methods: {
    startGame: function(event) {
      event.preventDefault()
      // update game in database
      // socket.emit(this.gameId)
    }
  }
}