/* This controller has the responsibilities of managing everything that concerns
 * the game: database data and the real time communication. */

const ErrorSender = require('../services/ErrorSender')
const gameCollection = require('../db_access/game')
const playersUtilities = require('../services/game/players/players')
const turnManager = require('../services/game/turns/turnManager')
const standardWinBehaviour = require('../services/game/victory/standardWinBehaviour')
const marienbadWinBehaviour = require('../services/game/victory/marienbadWinBehaviour')

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

/**
 * These events coordinate the game.
 */
function coordinateGameRoomWithSocketIO() {
  io.on('connection', function(socket) {
    const username = socket.handshake.query.username
    const playerJoinsGame = socket.handshake.query.playerJoinsGame
    const updatePlayersWaiting = socket.handshake.query.updatePlayersWaiting
    const startGame = socket.handshake.query.startGame
    const gameId = socket.handshake.query.gameId
    const disconnectPlayerWaiting = socket.handshake.query.disconnectPlayerWaiting
    propagatePlayerJoinsGame()
    propagateUpdatePlayersWaiting()
    updateGameAndPropagateStartGame()
    applyGameMoveAndHandleDisconnectionsThenPropagate()
    applyDisconnectionAndPropagate()

    function propagatePlayerJoinsGame() {
      socket.on(playerJoinsGame, function() {
        // console.log('[1] propagate ' + playerJoinsGame)
        io.emit(playerJoinsGame)
      })
    }

    function propagateUpdatePlayersWaiting() {
      socket.on(updatePlayersWaiting, function(username) {
        // console.log('[2] propagate ' + username + ' ' + updatePlayersWaiting)
        io.emit(updatePlayersWaiting, username)
      })
    }

    function updateGameAndPropagateStartGame() {
      socket.on(startGame, function(playersWaiting) {
        // console.log('[4] (1) propagate ' + startGame)
        const players = playersWaiting
        playersUtilities.shuffle(players)
        gameCollection.findGameById(gameId)
          .then((game) => {
            const activePlayer = turnManager.getActivePlayerForNewGame(game.turnRotation, players)
            gameCollection.updateGameWithPlayers(gameId, activePlayer, players)
              .then((game) => {
                // console.log('[4] (2) propagate ' + startGame)
                io.emit(startGame, game)
              })
          })
      })
    }

    function applyGameMoveAndHandleDisconnectionsThenPropagate() {
      socket.on(gameId, function(move) {
        const activePlayer = move.username
        const selectedSticks = move.selectedSticks
        // console.log('[5] propagate game move received from ' + activePlayer)
        // console.log(selectedSticks)
        gameCollection.findGameDocumentById(gameId)
          .then((gameDocument) => {
            if (activePlayer === gameDocument.activePlayer) {
              applyMoveOn(gameDocument)
              let win = false
              if (gameDocument.standardVictory) {
                win = standardWinBehaviour(gameDocument)
              } else {
                win = marienbadWinBehaviour(gameDocument)
              }
              propagateMove(win, gameDocument)
            } else {
              console.log('ERROR: a player that is not the active player has attempted to make a move')
            }

            function applyMoveOn(gameDocument) {
              selectedSticks.forEach((stick) => {
                gameDocument.sticks[stick.row][stick.position] = activePlayer
              })
              gameDocument.markModified('sticks')
            }
          })
      })
    }

    function propagateMove(win, gameDocument) {
      gameDocument.save()
        .then((game) => {
          if ( ! win) {
            io.emit(gameId, game)
          } else {
            const winObject = {
              winner: game.activePlayer,
              losers: game.eliminatedPlayers
            }
            io.emit(gameId, winObject)
          }
        })
    }

    function applyDisconnectionAndPropagate() {
      socket.on('disconnect', function() {
        gameCollection.findGameDocumentById(gameId)
          .then((gameDocument) => {
            /* if the game is deleted from the database and
              a player visits the previous game page
              (by clicking the go back button of the browser,
              or by checking the navigation history),
              this gameDocument is null and cause null pointer error,
              so the following "if (gameDocument)" is mandatory */
            if (gameDocument) {
              if (! gameDocument.players) {
                propagateDisconnectionWhileWaitingForGameStart()
              } else {
                propagateDisconnectionWhilePlaying()
              }

              function propagateDisconnectionWhileWaitingForGameStart() {
                // console.log('[3] propagate disconnection of ' + username)
                io.emit(disconnectPlayerWaiting, username)
              }

              function propagateDisconnectionWhilePlaying() {
                if (username === gameDocument.activePlayer) {
                  // console.log('[6] propagate disconnection of ' + username)
                  playersUtilities.take(username).addToDisconnectedPlayersOf(gameDocument)
                  const win = turnManager.handleDisconnectionWin(gameDocument)
                  propagateMove(win, gameDocument)
                } else {
                  // console.log('[6] add disconnection of ' + username)
                  playersUtilities.take(username).addToDisconnectedPlayersOf(gameDocument)
                  gameDocument.save()
                }
              }
            }
          })
      })
    }
  })
}