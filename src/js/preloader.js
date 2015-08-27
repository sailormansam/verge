GameStates.Preloader = function (game) {};

GameStates.Preloader.prototype = {
	preload: function () {
		this.load.image('background', 'images/cactus.jpg');
	},
	create: function () {
		game.state.start('mainmenu');
	}
};