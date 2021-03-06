module.exports = function(app) {
  initUserRoutes(app)
  initGameRoutes(app)
  useIndex(app)
}

function initUserRoutes(app) {
  const userController = require('./controllers/user')
  app.route('/register').post(userController.register)
  app.route('/login').post(userController.logIn)
  app.route('/get-user-logged-in').get(userController.getUserLoggedIn)
  app.route('/logout').post(userController.logOut)
  app.route('/delete-account').post(userController.deleteAccount)
}

function initGameRoutes(app) {
  const gameController = require('./controllers/game')
  app.route('/create-game').post(gameController.createGame)
  app.route('/get-game-by-id').post(gameController.getGameById)
}

function useIndex(app) {
  const webPageSender = require('./controllers/webPageSender')
  app.use(webPageSender.sendIndex) // app.route('/').get(webPageSender.sendIndex);
}