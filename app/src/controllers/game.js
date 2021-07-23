const gameCollection = require('../db_access/game')
const ResponseSender = require('../services/responseSender')
controlGameRoomWithSocketIO()

exports.createGameRoom = function(req, res) {
  const responseSender = new ResponseSender(res)
  const gameConfiguration = req.body
  const players = gameConfiguration.players
  const standardVictory = gameConfiguration.standardVictory
  const turnRotation = gameConfiguration.turnRotation
  const rows = gameConfiguration.rows
  const sticks = createSticks()
  const playersWithTurnDone = createPlayersWithTurnDone()
  insertNewGameIntoDB(sticks, standardVictory, turnRotation, players, playersWithTurnDone)
  
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

  function insertNewGameIntoDB(sticks, standardVictory, turnRotation, players, playersWithTurnDone) {
    gameCollection.insertNewGame(sticks, standardVictory, turnRotation, players, playersWithTurnDone)
      .then((result) => { res.send({ gameId: result._id }) })
      .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
  }
}

exports.getGameById = function(req, res) {
  const responseSender = new ResponseSender(res)
  const gameId = req.body.gameId
  gameCollection.findGameById(gameId)
    .then((result) => { res.send({ game: result }) })
    .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
}


function controlGameRoomWithSocketIO() {
  socketIO.on('connection', function(socket) {
    const gameRoomEvent = socket.handshake.query.gameRoomEvent
    const prepareGameEvent = socket.handshake.query.prepareGameEvent
    console.log(socket.id + ' joins the room ' + gameRoomEvent);
    
    // nickname: ricezione
    socket.on(prepareGameEvent, function(username){
      socket.username = username;
      console.log(username);
    });

    // invia messaggio a tutti i client
    socketIO.emit(gameRoomEvent, 
      {
        nickname: "server", content: "Un nuovo utente si è connesso"});

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

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