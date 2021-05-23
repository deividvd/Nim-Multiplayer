module.exports = function(app) {
  const userOperations = require('./controllers/userOperations')

  /*
  app.route('/login')
    .get()
    .post()

  app.route('/register')
    .post(userOperations.register)
  */

  /*
  // game
  app.route('/game-room/:id')
    .post(function (req, res) {
      // invio elementi eliminati ...
    });
  */
  
  const webPagesSender = require('./controllers/webPagesSender')

  app.route('/game-room')
    .get(webPagesSender.gameRoom)

  app.use(webPagesSender.index) // app.route('/').get(webPagesSender.index);

}