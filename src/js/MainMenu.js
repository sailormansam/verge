GameStates.MainMenu = function (game) {
	this.titleText;
	this.playText;
	this.editor;
};

GameStates.MainMenu.prototype = {
	create: function () {
		// title and play text
		this.titleText = game.add.text(game.width * .25, game.world.centerY, 'VERGE', textStyle['large']);
		this.titleText.anchor.set(0, 0.5);
		this.titleText.alpha = 0;
		
		this.playText = game.add.text(game.width * .25, game.height * .625, 'PLAY', textStyle['normal']);
		this.playText.anchor.set(0, 0.5);
		this.playText.alpha = 0;
		
		this.editor = game.add.text(game.width * .25, game.height * .7, 'EDITOR', textStyle['normal']);
		this.editor.anchor.set(0, 0.5);
		this.editor.alpha = 0;
		
		// tween in title and play button
		game.add.tween(this.titleText).to( { alpha: 1, x: game.width * .2 }, 500, Phaser.Easing.Quadratic.InOut, true);
		game.add.tween(this.playText).to( { alpha: 1, x: game.width * .2 }, 500, Phaser.Easing.Quadratic.InOut, true, 200);
		game.add.tween(this.editor).to( { alpha: 1, x: game.width * .2 }, 500, Phaser.Easing.Quadratic.InOut, true, 400);
		
		// click event to play
		this.playText.inputEnabled = true;
		this.playText.input.useHandCursor = true;
		this.playText.events.onInputDown.add(this.play, this);
		
		this.editor.inputEnabled = true;
		this.editor.input.useHandCursor = true;
		this.editor.events.onInputDown.add(this.playEditor, this);

		// lock mouse pointer to canvas
//		game.canvas.addEventListener('mousedown', function () { game.input.mouse.requestPointerLock(); });
	},
	play: function () {
		// tween the text out and then start game
		game.add.tween(this.titleText).to( { alpha: 0, x: game.width * .15 }, 500, Phaser.Easing.Quadratic.InOut, true);
		game.add.tween(this.playText).to( { alpha: 0, x: game.width * .15 }, 500, Phaser.Easing.Quadratic.InOut, true, 200);
		var t = game.add.tween(this.editor).to( { alpha: 0, x: game.width * .15 }, 500, Phaser.Easing.Quadratic.InOut, true, 400);
		t.onComplete.add(function () { game.state.start('Game'); }, this);
	},
	playEditor: function () {
		// tween the text out and then start game
		game.add.tween(this.titleText).to( { alpha: 0, x: game.width * .15 }, 500, Phaser.Easing.Quadratic.InOut, true);
		game.add.tween(this.playText).to( { alpha: 0, x: game.width * .15 }, 500, Phaser.Easing.Quadratic.InOut, true, 200);
		var t = game.add.tween(this.editor).to( { alpha: 0, x: game.width * .15 }, 500, Phaser.Easing.Quadratic.InOut, true, 400);
		t.onComplete.add(function () { game.state.start('Editor'); }, this);
	}
};
