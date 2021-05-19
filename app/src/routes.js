module.exports = function(app) {
  const userOperations = require('./controllers/userOperations')

  app.route('/login')
    .get()
    .post()

  app.route('/register')
    .post(userOperations.register)



  
  const webPagesSender = require('./controllers/webPagesSender')

  app.route('game-room/:id')
    .get(webPagesSender.gameRoom)
    .post(function (req, res) {
      // invio elementi eliminati ...
    });

  app.use(webPagesSender.index); // app.route('/').get(webPagesSender.index);

  app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
  });

};
