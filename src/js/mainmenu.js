GameStates.MainMenu = function (game) {
	this.background;
};

GameStates.MainMenu.prototype = {
	create: function () {
		this.background = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'background');
		this.background.anchor.setTo(0.5);
		this.background.scale.set(0.4);
	}
};