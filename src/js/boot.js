var GameStates = GameStates || {};
var textStyle = {
	'normal': { font: "3em squada one", fill: "#333"},
	'large': { font: "6em squada one", fill: "#333"}
};

GameStates.Boot = function (game) {};

GameStates.Boot.prototype = {
	init: function () {
		this.input.maxPointers = 1;
		game.stage.backgroundColor = '#ffffff';
	},
	create: function () {
		game.state.start('Preloader');
	}
};