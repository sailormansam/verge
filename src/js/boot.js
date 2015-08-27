var GameStates = GameStates || {};

GameStates.Boot = function (game) {};

GameStates.Boot.prototype = {
	init: function () {
		this.input.maxPointers = 1;
	},
	create: function () {
		game.state.start('preloader');
	}
};