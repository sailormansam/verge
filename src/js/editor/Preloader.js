GameStates.Preloader = function (game) {};

GameStates.Preloader.prototype = {
	preload: function () {
		var loadingText = game.add.text(game.width * .2, game.world.centerY, 'LOADING', textStyle['large']);
		loadingText.anchor.set(0, 0.5);
		
		// load map file
		game.load.json('map', '../map.json');
		
		// load images
		game.load.image('block', 'images/block.png');
	},
	create: function () {
		game.state.start('Editor');
	}
};
