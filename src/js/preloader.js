GameStates.Preloader = function (game) {};

GameStates.Preloader.prototype = {
	preload: function () {
		var loadingText = game.add.text(game.width * .2, game.world.centerY, 'LOADING', textStyle['large']);
		loadingText.anchor.set(0, 0.5);
	},
	create: function () {
		game.state.start('MainMenu');
	}
};