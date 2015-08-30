GameStates.MainMenu = function (game) {
	this.background;
};

GameStates.MainMenu.prototype = {
	create: function () {
        var loadingText = game.add.text(game.world.centerX, game.width * 2, 'VERGE', { font: "6em squada one", fill: "#333"});
		this.background.anchor.setTo(0.5);
		this.background.scale.set(0.4);
	}
};