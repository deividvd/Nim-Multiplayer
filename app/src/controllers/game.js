const gameCollection = require('../db_access/game')
const ErrorSender = require('../services/ErrorSender')
controlGameRoomWithSocketIO()

exports.createInvitePlayerRoom = function(req, res) {
  const invitePlayerRoomConfiguration = req.body
  const rows = invitePlayerRoomConfiguration.rows
  const standardVictory = invitePlayerRoomConfiguration.standardVictory
  const turnRotation = invitePlayerRoomConfiguration.turnRotation
  gameCollection.insertNewInvitePlayerRoom(rows, standardVictory, turnRotation)
    .then((result) => {
      res.send({ gameId: result._id })
    })
    .catch((dbError) => { 
      const errorSender = new ErrorSender(res)
      errorSender.sendDatabaseError(dbError)
    })
}

exports.getGameById = function(req, res) {
  const responseSender = new ErrorSender(res)
  const gameDoesNotExistMessage = "<b>ERROR</b>: this game doesn't exist, you have to create a new one!"
  const gameId = req.body.gameId
  if (isIdentifierValidForMongoDB(gameId)) {
    gameCollection.findGameById(gameId)
      .then((result) => { sendGame(result) })
      .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
  } else {
    responseSender.sendExceptionMessage(gameDoesNotExistMessage)
  }
  
  function isIdentifierValidForMongoDB(id) {
    return /[0-9A-Fa-f]{24}/.test(id)
  }

  function sendGame(game) {
    if (game) {
      res.status(200).send({ game: game })
    } else {
      responseSender.sendExceptionMessage(gameDoesNotExistMessage)
    }
  }
}

///// 

exports.updateInvitePlayerRoomToGameRoom = function(req, res) {
  const responseSender = new ErrorSender(res)
  const gameId = req.body.gameId
  const players = shufflePlayerRotation(req.body.players)
  gameCollection.findGameById(gameId)
    .then((result) => {
      const sticks = createSticks(result.sticks[0])
      gameCollection.updateInvitePlayerRoomToGameRoom(gameId, sticks, players)
        .then((result) => { res.status(201).send({}) })
        .catch((dbError) => { responseSender.sendDatabaseError(dbError) })
    })
 
  function shufflePlayerRotation(player, turnRotation) {
    if (turnRotation) {
      var currentIndex = player.length, randomIndex
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [player[currentIndex], player[randomIndex]] = [player[randomIndex], player[currentIndex]]
      }
      return player
    }
    return player
  }

  function createSticks(rows) {
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
        // console.log('2 - notify: ' + username + '; event = ' + notify);
      })
    }

    function setupUpdateReceptionOf(socket) {
      socket.on(update, function(user) {
        io.emit(update, user)
        // console.log('3 - update: ' + user.username + '; disconnected = ' + user.disconnected + '; event = ' + update);
      })
    }

    function setupDisconnectionReceptionOf(socket) {
      socket.on('disconnect', function() {
        const user = {
          username: socket.username,
          disconnected: true,
        }
        io.emit(update, user)
        console.log('all listeners: \n' + socket.listenersAny())
        // console.log('5 - disconnection: ' + user.username + '; event = ' + update);
      })
    }

    function setupStartGame(socket) {
      const gameId = socket.handshake.query.gameId
      socket.on(gameId, function() {
        socket.removeAllListeners(notify)
        socket.removeAllListeners(update)
        io.emit(gameId)
        // console.log('6 - start game: ' + gameId);
      })
    }
  })
}