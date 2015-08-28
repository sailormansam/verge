GameStates.Preloader = function (game) {};

GameStates.Preloader.prototype = {
	preload: function () {
		var loadingText = game.add.text(game.world.centerX, game.world.centerY, 'LOADING', { font: "4em squada one", fill: "#333", align: "center" });
		loadingText.anchor.set(0.5);
		
		this.load.image('background', 'images/cactus.jpg');
	},
	create: function () {
		game.state.start('mainmenu');
	}
};