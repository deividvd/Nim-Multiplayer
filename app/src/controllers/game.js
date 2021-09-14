/* This controller has the responsibilities of managing everything that concerns
 * the game: database data and the real time communication. */

const gameCollection = require('../db_access/game')
const ErrorSender = require('../services/ErrorSender')
const playersUtilities = require('../services/game/players')
const rotationTurns = require('../services/game/turns/rotation')
const chaosTurns = require('../services/game/turns/chaos')
const standardVictory = require('../services/game/victory/standard')
// const marienbadVictory = require('../services/game/victory/marienbad')
const disconnectionWin = require('../services/game/victory/disconnectionWin')
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
        console.log('[1] propagate ' + playerJoinsGame)
        io.emit(playerJoinsGame)
      })
    }

    function propagateUpdatePlayersWaiting() {
      socket.on(updatePlayersWaiting, function(username) {
        console.log('[2] propagate ' + username + ' ' + updatePlayersWaiting)
        io.emit(updatePlayersWaiting, username)
      })
    }

    function updateGameAndPropagateStartGame() {
      socket.on(startGame, function(playersWaiting) {
        console.log('[4] (1) propagate ' + startGame)
        const players = playersWaiting
        playersUtilities.shuffle(players)
        gameCollection.findGameById(gameId)
          .then((game) => {
            const activePlayer = getActivePlayerForNewGame(game.turnRotation, players)
            gameCollection.updateGameWithPlayers(gameId, activePlayer, players)
              .then((game) => {
                console.log('[4] (2) propagate ' + startGame)
                io.emit(startGame, game)
              })
          })
 
        function getActivePlayerForNewGame(turnRotation, players) {
          let activePlayer
          if (turnRotation) {
            activePlayer = rotationTurns.getActivePlayerForNewGame(players)
          } else {
            activePlayer = chaosTurns.getActivePlayerForNewGame(players)
          }
          return activePlayer
        }
      })
    }

    function applyGameMoveAndHandleDisconnectionsThenPropagate() {
      socket.on(gameId, function(move) {
        const activePlayer = move.username
        const selectedSticks = move.selectedSticks
        console.log('[5] (1) propagate game move received from ' + activePlayer)
        console.log(selectedSticks)
        gameCollection.findGameDocumentById(gameId)
          .then((gameDocument) => {
            if (activePlayer === gameDocument.activePlayer) {
              applyMove()
              let win = applyWinOrApplyAllSticksRemoved(gameDocument)
              if ( ! win) {
                nextTurnAndRemoveDisconnectionsDetected(gameDocument)
                win = applyWinOrApplyAllSticksRemoved(gameDocument)
              }
              propagateMove(win, activePlayer, gameDocument)
            } else {
              console.log('ERROR: a player that is not the active player has attempted to make a move')
            }

            function applyMove() {
              selectedSticks.forEach((stick) => {
                gameDocument.sticks[stick.row][stick.position] = activePlayer
              })
              gameDocument.markModified('sticks')
            }
          })
      })
    }

    function applyWinOrApplyAllSticksRemoved(gameDocument) {
      /* here the program should choose between standard or marienbad consequences caused
         when all sticks are removed:
          - in standard victory, all sticks removed means always victory,
          - in marienbad victory, all sticks removed means the loss of one player,
            and if only one players is in game, then the game is win */
      console.log("standard win = " + standardVictory.applySticksWin(gameDocument));
      console.log("single player in game win = " + disconnectionWin.onlyOnePlayerInGame(gameDocument));
      console.log();
      return ( standardVictory.applySticksWin(gameDocument) ||
          disconnectionWin.onlyOnePlayerInGame(gameDocument) )
    }

    function nextTurnAndRemoveDisconnectionsDetected(gameDocument) {
      applyNextTurn()
      handleDisconnections()

      function applyNextTurn() {
        console.log("(1) applyNextTurn = " + gameDocument.activePlayer);
        if (gameDocument.turnRotation) {
          rotationTurns.nextTurn(gameDocument)
        } else {
          chaosTurns.nextTurn(gameDocument)
        }
        gameDocument.markModified('activePlayer')
        console.log("(2) applyNextTurn = " + gameDocument.activePlayer);
      }

      function handleDisconnections() {
        /* here the program should choose between standard or marienbad consequences caused
           when a disconnected user is detected:
            - in standard victory, nothing happen,
            - in marienbad victory, all sticks are refreshed except for
              those removed by disconnected players */
        if (gameDocument.disconnectedPlayers.includes(gameDocument.activePlayer)) {
          console.log('found disconnected player = ' + gameDocument.activePlayer);
          const disconnectedPlayer = gameDocument.activePlayer
          playersUtilities.removePlayer(disconnectedPlayer).fromPlayersOf(gameDocument)
          playersUtilities.removePlayer(disconnectedPlayer).fromDisconnectedPlayersOf(gameDocument)
          gameDocument.eliminatedPlayers.push(disconnectedPlayer)
          gameDocument.markModified('eliminatedPlayers')
          nextTurnAndRemoveDisconnectionsDetected(gameDocument)
        }
      }
    }

    function propagateMove(win, activePlayer, gameDocument) {
      gameDocument.save()
        .then((game) => {
          if (! win) {
            console.log('[5] (2) propagate game move received from ' + activePlayer)
            io.emit(gameId, game)
          } else {
            console.log('[5] (2) propagate winning move received from ' + activePlayer)
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
            /* if the game is canceled from database and a user visits the game page,
               this gameDocument is null and cause null pointer error */
            if (gameDocument) {
              if (! gameDocument.players) {
                propagateDisconnectionWhileWaitingForGameStart()
              } else {
                propagateDisconnectionWhilePlaying()
              }

              function propagateDisconnectionWhileWaitingForGameStart() {
                console.log('[3] propagate disconnection of ' + username)
                io.emit(disconnectPlayerWaiting, username)
              }

              function propagateDisconnectionWhilePlaying() {
                if (username === gameDocument.activePlayer) {
                  /* here the program should choose between standard or marienbad consequences caused
                     when a disconnected user is detected:
                      - in standard victory, nothing happen,
                      - in marienbad victory, all sticks are refreshed except for
                        those removed by disconnected players */
                  console.log('[6] propagate disconnection of ' + username)
                  playersUtilities.removePlayer(username).fromPlayersOf(gameDocument)
                  gameDocument.eliminatedPlayers.push(username)
                  gameDocument.markModified('eliminatedPlayers')
                  let win = applyWinOrApplyAllSticksRemoved(gameDocument)
                  if ( ! win) {
                    nextTurnAndRemoveDisconnectionsDetected(gameDocument)
                    win = applyWinOrApplyAllSticksRemoved(gameDocument)
                  }
                  propagateMove(win, null, gameDocument)
                } else {
                  // here, standard victory and marienbad should do the same thing
                  console.log('[6] add disconnection of ' + username)
                  gameDocument.disconnectedPlayers.push(username)
                  gameDocument.markModified('disconnectedPlayer')
                  gameDocument.save()
                }
              }
            }
          })
      })
    }
  })
}