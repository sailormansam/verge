GameStates.GameOver = function (game) {};

GameStates.GameOver.prototype = {
	create: function () {
		// title and play text
		this.titleText = game.add.text(game.width * 0.25, game.height * 0.5, 'TIME ' + (time/1000).toFixed(0).toString(), textStyle['large']);
		this.titleText.anchor.set(0, 0.5);
		this.titleText.alpha = 0;
		
		this.playText = game.add.text(game.width * 0.25, game.height * 0.625, 'PLAY AGAIN', textStyle['normal']);
		this.playText.anchor.set(0, 0.5);
		this.playText.alpha = 0;
		
		// tween in title and play button
		game.add.tween(this.titleText).to( { alpha: 1, x: game.width * 0.2 }, 500, Phaser.Easing.Quadratic.InOut, true);
		game.add.tween(this.playText).to( { alpha: 1, x: game.width * 0.2 }, 500, Phaser.Easing.Quadratic.InOut, true, 200);
		
		// click event to play
		this.playText.inputEnabled = true;
		this.playText.input.useHandCursor = true;
		this.playText.events.onInputDown.add(this.play, this);
	},
	play: function() {
		// tween the text out and then start game
		game.add.tween(this.titleText).to( { alpha: 0, x: game.width * 0.15 }, 500, Phaser.Easing.Quadratic.InOut, true);
		var t = game.add.tween(this.playText).to( { alpha: 0, x: game.width * 0.15 }, 500, Phaser.Easing.Quadratic.InOut, true, 200);
		t.onComplete.add(function () { game.state.start('Game'); }, this)
	}
};
