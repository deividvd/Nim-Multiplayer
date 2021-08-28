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
  const players = req.body.playersWaitingForGameStart
  gameCollection.findGameById(gameId)
    .then((game) => {
      turnUtilities.shufflePlayers(players)
      const activePlayer = { player: null }
      prepareGame(players, activePlayer, game.turnRotation)
      const playersWithTurnDone = []
      gameCollection.updateGameWithPlayers(gameId, players, playersWithTurnDone, activePlayer.player)
        .then((game) => { res.sendStatus(201) /* equivalent to res.status(201).send('OK')*/ })
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
    const username = socket.handshake.query.username
    socket.username = username
    const userJoinGameRoom = socket.handshake.query.userJoinGameRoom
    const userUpdate = socket.handshake.query.userUpdate
    const gameUpdate = socket.handshake.query.gameUpdate
    propagateUserJoinGameRoom()
    propagateUserUpdate()
    propagateStartGame()
    propagateGameUpdate()
    propagateDisconnection()

    function propagateUserJoinGameRoom() {
      socket.on(userJoinGameRoom, function(username) {
        // console.log('1 - emit: ' + userJoinGameRoom + ' : ' + username);
        io.emit(userJoinGameRoom, username)
      })
    }

    function propagateUserUpdate() {
      socket.on(userUpdate, function(user) {
        // console.log('2 - emit: ' + userUpdate + ' : ' + user.username + '; disconnected = ' + user.disconnected);
        io.emit(userUpdate, user)
      })
    }

    function propagateStartGame() {
      const startGame = socket.handshake.query.startGame
      socket.on(startGame, function() {
        // console.log('6 - ' + startGame);
        io.emit(startGame)
      })
    }

    function propagateGameUpdate() {
      socket.on(gameUpdate, function(removedSticks) {
        // console.log('7 - move received' + removedSticks);
        io.emit(gameUpdate)
      })
    }

    function propagateDisconnection() {
      socket.on('disconnect', function() {
        // console.log('5 - disconnection: ' + user.username + '; event = ' + update);
        updatePlayersWaitingForGameStart()
        // updateGameWithDisconnectionOf(socket.username)
      })

      function updatePlayersWaitingForGameStart() {
        const user = {
          username: username,
          disconnected: true,
        }
        io.emit(userUpdate, user)
      }

      function updateGameWithDisconnectionOf(username) {
        gameCollection.findGameDocumentById(gameUpdate)
          .then((gameDocument) => {
            const players = gameDocument.players
            if (players) { // if a game contains players, then it's started
              if (gameDocument.activePlayer === username) {

              } else {
                const activePlayerIndex = players.indexOf(activePlayer)
                if (index > -1) {
                  gameDocument.players.splice(activePlayerIndex, 1)
                }
              }
              if (gameDocument.standardVictory) {
                io.emit(startGame)
              } else {
                // TODO
              }
            }
            
            if (gameDocument.players) { 
              gameDocument.eliminatedPlayers.push(username)
              gameDocument.save()
            }
          })
          .catch((dbError) => { errorSender.sendDatabaseError(dbError) })
      }
    }
  })
}