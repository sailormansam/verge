GameStates.MainMenu = function (game) {};

GameStates.MainMenu.prototype = {
	create: function () {
		var titleText = game.add.text(game.width * .25, game.world.centerY, 'VERGE', textStyle['large']);
		titleText.anchor.set(0, 0.5);
		titleText.alpha = 0;
		
		var playText = game.add.text(game.width * .25, game.height * .625, 'PLAY', textStyle['normal']);
		playText.anchor.set(0, 0.5);
		playText.alpha = 0;
		
		// tween in title and play button
		game.add.tween(titleText).to( { alpha: 1, x: game.width * .2 }, 500, Phaser.Easing.Quadratic.InOut, true);
		game.add.tween(playText).to( { alpha: 1, x: game.width * .2 }, 500, Phaser.Easing.Quadratic.InOut, true, 200);
		
		// click event to play
		playText.inputEnabled = true;
		playText.input.useHandCursor = true;
		playText.events.onInputDown.add(this.play, this);
	},
	play: function() {
		game.state.start('game');
	}
};