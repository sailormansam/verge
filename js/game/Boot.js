var GameStates = GameStates || {};
var textStyle = {
	'normal': { font: "3em squada one", fill: "#333"},
	'large': { font: "6em squada one", fill: "#333"}
};

var blockType = {
	STATIC: "STATIC",
	DYNAMIC: "DYNAMIC"
};

GameStates.Boot = function (game) {};

GameStates.Boot.prototype = {
	init: function () {
		this.input.maxPointers = 1;
		game.stage.backgroundColor = '#ffffff';
		
		// block default right click to use for other actions
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	},
	create: function () {
		game.state.start('Preloader');
	}
};
