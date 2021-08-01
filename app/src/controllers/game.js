const gameCollection = require('../db_access/game')
const ErrorSender = require('../services/ErrorSender')
const turnUtilities = require('../services/game/turns/turnUtilities')
const rotationTurns = require('../services/game/turns/rotation')
const chaosTurns = require('../services/game/turns/chaos')
coordinateGameRoomWithSocketIO()

exports.createGame = function(req, res) {
  const gameConfiguration = req.body
  const rows = gameConfiguration.rows
  const sticks = createSticks(rows)
  const standardVictory = gameConfiguration.standardVictory
  const turnRotation = gameConfiguration.turnRotation
  gameCollection.insertNewGame(sticks, standardVictory, turnRotation)
    .then((game) => {
      res.send({ gameId: game._id })
    })
    .catch((dbError) => { 
      const errorSender = new ErrorSender(res)
      errorSender.sendDatabaseError(dbError)
    })

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

exports.getGameById = function(req, res) {
  const gameId = req.body.gameId
  if (isIdentifierValidForMongoDB(gameId)) {
    gameCollection.findGameById(gameId)
      .then((game) => {
        sendGame(game)
      })
      .catch((dbError) => {
        const errorSender = new ErrorSender(res)
        errorSender.sendDatabaseError(dbError)
      })
  } else {
    sendGameDoesntExist()
  }
  
  function isIdentifierValidForMongoDB(id) {
    return /[0-9A-Fa-f]{24}/.test(id)
  }

  function sendGame(game) {
    if (game) {
      res.status(200).send({ game: game })
    } else {
      sendGameDoesntExist()
    }
  }

  function sendGameDoesntExist() {
    res.status(200).send({ game: false })
  }
}

exports.updateGameWithPlayers = function(req, res) {
  const errorSender = new ErrorSender(res)
  const gameId = req.body.gameId
  const players = req.body.waitingPlayers
  gameCollection.findGameById(gameId)
    .then((game) => {
      turnUtilities.shufflePlayers(players)
      const activePlayer = { player: null }
      prepareGame(players, activePlayer, game.turnRotation)
      const playersWithTurnDone = []
      gameCollection.updateGameWithPlayers(gameId, players, playersWithTurnDone, activePlayer.player)
        .then((game) => { res.sendStatus(201) /* Equivalent to res.status(201).send('OK')*/ })
        .catch((dbError) => { errorSender.sendDatabaseError(dbError) })
    })
 
  function prepareGame(players, activePlayer, turnRotation) {
    if (turnRotation) {
      rotationTurns.prepareGame(players, activePlayer)
    } else {
      chaosTurns.prepareGame(players, activePlayer)
    }
  }
}

function coordinateGameRoomWithSocketIO() {
  io.on('connection', function(socket) {
    socket.username = socket.handshake.query.username
    const userJoinGameRoom = socket.handshake.query.userJoinGameRoom
    const userUpdate = socket.handshake.query.userUpdate
    receiveUserJoinGameRoom()
    receiveUserUpdate()
    receiveGameUpdate()
    receiveDisconnection()
    
    function receiveUserJoinGameRoom() {
      socket.on(userJoinGameRoom, function(username) {
        // console.log('1 - emit: ' + userJoinGameRoom + ' : ' + username);
        io.emit(userJoinGameRoom, username)
      })
    }

    function receiveUserUpdate() {
      socket.on(userUpdate, function(user) {
        // console.log('2 - emit: ' + userUpdate + ' : ' + user.username + '; disconnected = ' + user.disconnected);
        io.emit(userUpdate, user)
      })
    }

    function receiveDisconnection() {
      socket.on('disconnect', function() {
        // console.log('5 - disconnection: ' + user.username + '; event = ' + update);
        updateWaitingPlayers()
        // updateGame()
      })

      function updateWaitingPlayers() {
        const user = {
          username: socket.username,
          disconnected: true,
        }
        io.emit(userUpdate, user)
      }

      function updateGame() {
        gameCollection.findGameById(updateGame)
          // .then(result)

        const usernameIndex = waitingPlayers.indexOf(username);
        if (usernameIndex !== -1) {
          waitingPlayers.splice(usernameIndex, 1);
        }
      }
    }

    function receiveGameUpdate() {
      const gameUpdate = socket.handshake.query.gameUpdate
      socket.on(gameUpdate, function() {
        // console.log('6 - game update: ' + gameId);
        io.emit(gameUpdate)
      })
    }
  })
}