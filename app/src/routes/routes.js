module.exports = function(app) {

	app.route('/register')
		.get();

	app.route('/login')
		.get();

	app.route('/create-game-room')
		.get();



	var webPagesController = require('../controllers/webPagesController');

	app.route('game-room/:game_id')
		.get(webPagesController.gameRoom)
		.post(function (req, res) {
			// invio elementi eliminati ...
		});

	app.use(webPagesController.index); // app.route('/').get(webPagesController.show_index);

	app.use(webPagesController.show_404);

};
