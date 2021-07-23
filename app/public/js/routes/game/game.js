const GameRoom = {
  template:
  `
  <main>
    <section>
      <h1> Time to play the game! </h1>

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

    connectSocketIO(this)

    function initializeSticksOf(vueComponent) {
      axios.post(serverAddress + 'game-room', { gameId: vueComponent.gameId })
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

    function connectSocketIO(vueComponent) {
      const gameRoomEvent = vueComponent.gameId 
      const prepareGameEvent = gameRoomEvent + 'preparation'
      // questa riga fa triggerare la connection!!!
      console.log("porcodiooo");
      const socket = io(serverAddress,
        {
          query: {
            // username: vueComponent.username,
            gameRoomEvent: gameRoomEvent,
            prepareGameEvent: prepareGameEvent
          } 
        })
      console.log("diocaneee");
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
    selectStick: function(stick) {
      console.log("row:" + stick.row + "-number:" + stick.number + "-value:" + stick.value);
      stick.removed = true
      console.log(this.username);
    }
  }
}