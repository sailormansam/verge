GameStates.Preloader = function (game) {};

GameStates.Preloader.prototype = {
	preload: function () {
		var loadingText = game.add.text(game.width * .2, game.world.centerY, 'LOADING', textStyle['large']);
		loadingText.anchor.set(0, 0.5);
		
		// load map file
		game.load.json('map', '../map.json');
		
		// load images
		game.load.image('block', 'images/block.png');
		game.load.image('bubble', 'images/bubble.png');
		game.load.image('save', 'images/save.png');
		game.load.image('load', 'images/load.png');
	},
	create: function () {
		game.state.start('Editor');
	}
};
