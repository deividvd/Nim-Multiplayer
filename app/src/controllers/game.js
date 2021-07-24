const gameCollection = require('../db_access/game')
const ResponseSender = require('../services/responseSender')
controlGameRoomWithSocketIO()

exports.createInvitePlayerRoom = function(req, res) {
  const responseSender = new ResponseSender(res)
  const invitePlayerRoomConfiguration = req.body
  const standardVictory = invitePlayerRoomConfiguration.standardVictory
  const turnRotation = invitePlayerRoomConfiguration.turnRotation
  const rows = invitePlayerRoomConfiguration.rows
  insertNewInvitePlayerRoomIntoDB(rows, standardVictory, turnRotation)
  
  function insertNewInvitePlayerRoomIntoDB(rows, standardVictory, turnRotation) {
    gameCollection.insertNewInvitePlayerRoom(rows, standardVictory, turnRotation)
      .then((result) => { res.send({ gameId: result._id }) })
      .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
  }
}

exports.getGameById = function(req, res) {
  const responseSender = new ResponseSender(res)
  const gameId = req.body.gameId
  if (isIdValidForMongoDB(gameId)) {
    gameCollection.findGameById(gameId)
      .then((result) => { res.send({ game: result }) })
      .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
  } else {
    res.send({ game: null })
  }
  
  function isIdValidForMongoDB(id) {
    return /[0-9A-Fa-f]{24}/.test(id)
  }
}

/////////////////////////////////////////////////////////////////////////

exports.createGameRoom = function(req, res) {

  // standard victory
  function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  const sticks = createSticks()
  const playersWithTurnDone = createPlayersWithTurnDone()
  insertNewGameIntoDB(sticks, standardVictory, turnRotation, playersWithTurnDone)

  function createSticks() {
    const sticks = []
    for (let row = 0; row < rows; row++) {
      const stickRow = []
      for (let stick = 0; stick <= row; stick++) {
        stickRow.push(true)
      }
      sticks.push(stickRow)
    }
    return sticks
  }

  function createPlayersWithTurnDone() {
    if (turnRotation) {
      return Math.floor(Math.random() * players)
    }
    return []
  }

  function insertNewGameIntoDB(sticks, standardVictory, turnRotation, playersWithTurnDone) {
    gameCollection.insertNewGame(sticks, standardVictory, turnRotation, playersWithTurnDone)
      .then((result) => { 
        console.log(result._id);
        res.send({ gameId: result._id }) })
      .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
  }
}

function controlGameRoomWithSocketIO() {
  // 'connection' event = a player join the "invite-player-room"
  io.on('connection', function(socket) {
    socket.username = socket.handshake.query.username
    const notify = socket.handshake.query.notify
    const update = socket.handshake.query.update
    setupStartGame(socket)
    setupUpdateReceptionOf(socket)
    setupDisconnectionReceptionOf(socket)
    setupNotifyReceptionOf(socket)

    function setupNotifyReceptionOf(socket) {
      socket.on(notify, function(username) {
        io.emit(notify, username)
        console.log('2 - notify: ' + username + '; event = ' + notify);
      })
    }

    function setupUpdateReceptionOf(socket) {
      socket.on(update, function(user) {
        io.emit(update, user)
        console.log('3 - update: ' + user.username 
            + '; disconnected = ' + user.disconnected + '; event = ' + update);
      })
    }

    function setupDisconnectionReceptionOf(socket) {
      socket.on('disconnect', function() {
        const user = {
          username: socket.username,
          disconnected: true,
        }
        io.emit(update, user)
        console.log('5 - disconnection: ' + user.username + '; event = ' + update);
      })
    }

    function setupStartGame(socket) {
      const gameId = socket.handshake.query.gameId
      socket.on(gameId, function() {
        socket.removeAllListeners(notify)
        socket.removeAllListeners(update)
        console.log('all listeners: \n' + socket.listenersAny())
        // define game listeners
        io.emit(gameId)
      })
    }
    

    // invia messaggio a tutti i client
    /*
    socketIO.emit(gameRoomEvent, 
      {
        nickname: "server", content: "Un nuovo utente si è connesso"});

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
*/
    /*
    // invia messaggio a tutti i client
    io.emit('chat message', { nickname: "server", content: "Un nuovo utente si è connesso"});
    
    socket.nickname = "Anonimo";
  
    // nickname: ricezione
    socket.on('change nickname', function(nickname){
      socket.nickname = nickname;
    console.log(nickname);
    }); 
    
    // message: ricezione e invio
    socket.on('chat message', function(msg){
      io.emit('chat message', { nickname: socket.nickname, content: msg});
    });
    
    // DISCONNESSIONE
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    */
  })
}