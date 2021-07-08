module.exports = function(app) {
  createUserRoutes(app)
  createGameRoutes(app)
  useIndex(app)
}

function createUserRoutes(app) {
  const userController = require('./controllers/user')
  app.route('/register').post(userController.register)
  app.route('/login').post(userController.logIn)
  app.route('/get-user-logged-in').get(userController.getUserLoggedIn)
  app.route('/logout').post(userController.logOut)
  app.route('/delete-account').post(userController.deleteAccount)
}

function createGameRoutes(app) {
  //const gameController = require('./controllers/gameController')
  app.route('/create-game-room')
    //.post
  app.route('/game/:id')
}

function useIndex(app) {
  const webPageSender = require('./controllers/webPageSender')
  app.use(webPageSender.sendIndex) // app.route('/').get(webPageSender.sendIndex);
}