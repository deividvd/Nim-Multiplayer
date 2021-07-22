const gameCollection = require('../db_access/game')
const ResponseSender = require('../services/responseSender')

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