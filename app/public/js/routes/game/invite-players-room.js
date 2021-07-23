const WaitPlayersRoom = {
  components: {
    'app-header': AppHeader,
  },
  template:
  `
  <div>

    <app-header/>

    <main>
      <section>
        <h2> Invite other Players! </h2>

        <div v-if="gameExists & username">
          <p> Copy and link the URL of this page to invite other players! </p>

          <p class="errorMessage"> Do <b>NOT REFRESH</b> the page or you will be <b>ELIMINATED</b> from the game. </p>

          <form>
            <p> Max Player Number {{ maxPlayerNumber }} </p>
          
            <ol>
              <li> {{ username }} </li>
              <li v-for="player in players">
                {{ player }}
              </li>
            </ol>
          </form>
        </div>
        <div v-else>
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
          // connectSocketIO(this)
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
      const gameRoomEvent = vueComponent.gameId 
      const prepareGameEvent = gameRoomEvent + 'preparation'
      // questa riga fa triggerare la connection!!!
      const socket = io(serverAddress,
        {
          query: {
            // username: vueComponent.username,
            gameRoomEvent: gameRoomEvent,
            prepareGameEvent: prepareGameEvent
          } 
        })
      /*
      // nickname: invio
      $('#form_nickname').submit(function(e){
		    e.preventDefault();
        socket.emit('change nickname', $('#nickname').val());
        return false;
      });

      // message: invio
		  $('#form_messages').submit(function(e){
		    e.preventDefault();
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
      
      // message: ricezione
      socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg.nickname + ": " + msg.content));
      });
      */

    }
  },
  methods: {
  }
}