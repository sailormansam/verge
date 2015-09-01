GameStates.Game = function (game) {
	this.player = null;
};

GameStates.Game.prototype = {
	create: function () {
		// create player
		this.player = new Player();
	},
	update: function () {
		
	}
};