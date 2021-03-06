var GameStates = GameStates || {};
var textStyle = {
    'small': { font: "2em squada one", fill: "#ffffff"},
	'normal': { font: "3em squada one", fill: "#334D62"},
	'large': { font: "6em squada one", fill: "#ffffff"}
};

var blockType = {
	STATIC: "STATIC",
	DYNAMIC: "DYNAMIC"
};

GameStates.Boot = function (game) {};

GameStates.Boot.prototype = {
	init: function () {
		this.input.maxPointers = 1;
		game.stage.backgroundColor = '#4AC5D0';
		
		// block default right click to use for other actions
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	},
	create: function () {
		game.state.start('Preloader');
	}
};
