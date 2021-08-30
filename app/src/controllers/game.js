/* This controller has the responsibilities of managing everything that concerns
 * the game: database data and the real time communication. */

const gameCollection = require('../db_access/game')
const ErrorSender = require('../services/ErrorSender')
const shufflePlayers = require('../services/game/turns/utilities/shufflePlayers')
const rotationTurns = require('../services/game/turns/rotation')
const chaosTurns = require('../services/game/turns/chaos')
coordinateGameRoomWithSocketIO()

/**
 * POST request with a game configuration in its body.
 * 
 * A user inserts a new game (without any player) into the database.
 */
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
        stickRow.push(false)
      }
      sticks.push(stickRow)
    }
    return sticks
  }
}

/**
 * POST request with a game id in its body.
 * 
 * Send the corresponding game.
 */
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
    res.status(200).send({ game: null })
  }
}

function coordinateGameRoomWithSocketIO() {
  io.on('connection', function(socket) {
    const username = socket.handshake.query.username
    socket.username = username
    const userJoinGameRoom = socket.handshake.query.userJoinGameRoom
    const userUpdate = socket.handshake.query.userUpdate
    const startGame = socket.handshake.query.startGame
    const gameId = socket.handshake.query.gameId
    propagateUserJoinGameRoom()
    propagateUserUpdate()
    receiveStartGame()
    receiveGameMove()
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

    function receiveStartGame() {
      socket.on(startGame, function(playersWaitingForGameStart) {
        // console.log('4 - ' + startGame);
        const gameId = startGame.substring(7) // substring(7) because it must remove 'start: '
        const players = playersWaitingForGameStart
        gameCollection.findGameById(gameId)
          .then((game) => {
            shufflePlayers.shuffle(players)
            const activePlayerObj = { player: null }
            setActivePlayerForNewGame(game.turnRotation, activePlayerObj, players)
            const playersWithTurnDone = []
            gameCollection.updateGameWithPlayers(gameId, players, playersWithTurnDone, activePlayerObj.player)
              .then((game) => { io.emit(startGame, game) })
          })
 
        function setActivePlayerForNewGame(turnRotation, activePlayerObj, players) {
          if (turnRotation) {
            rotationTurns.setActivePlayerForNewGame(activePlayerObj, players)
          } else {
            chaosTurns.setActivePlayerForNewGame(activePlayerObj, players)
          }
        }
      })
    }

    function receiveGameMove() {
      socket.on(gameId, function(move) {
        // console.log('5 - move received from ' + move.username);
        // console.log(move.selectedSticks);
        gameCollection.findGameDocumentById(gameId)
          .then((gameDocument) => {
            const activePlayer = move.username
            if (activePlayer === gameDocument.activePlayer) {
              executeMoveOnGame(move, gameDocument)
              // TODO win ???
              nextTurn(gameDocument)
              gameDocument.markModified('sticks')
              gameDocument.markModified('activePlayer')
              gameDocument.markModified('players')
              gameDocument.markModified('playersWithTurnDone')
              gameDocument.save()
                .then((game) => {
                  io.emit(gameId, game) })
            } else {
              console.log('ERROR: a player that is not the active player has made a move ');
            }
          })

        function executeMoveOnGame(move, game) {
          move.selectedSticks.forEach(setRemovedByActivePlayer);
 
          function setRemovedByActivePlayer(stick, index) {
            game.sticks[stick.row][stick.position] = move.username
          }
        }

        function nextTurn(game) {
          if (game.turnRotation) {
            rotationTurns.nextTurn(game)
          } else {
            chaosTurns.nextTurn(game)
          }
        }
      })
    }

    function propagateDisconnection() {
      socket.on('disconnect', function() {
        // console.log('3 - disconnection: ' + user.username + '; event = ' + update);
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
        gameCollection.findGameDocumentById(gameId)
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