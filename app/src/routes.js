module.exports = function(app) {

  createUserRoutes(app)

  //const gameController = require('./controllers/gameController')

  //app.route('/create-game-room/').post(gameController.createGameRoom)

  const webPagesSender = require('./controllers/webPagesSender')
  
  app.route('/game-room/:id')
    .get(webPagesSender.gameRoom)
    //.post(gameController.applyMove)
  app.use(webPagesSender.index) // app.route('/').get(webPagesSender.index);

}

function createUserRoutes(app) {
  const userController = require('./controllers/user')
  app.route('/register').post(userController.register)
  app.route('/login').post(userController.login)
  app.route('/get-user-logged-in').get(userController.getUserLoggedIn)
  // app.route('/account').post(userController.delete)
}