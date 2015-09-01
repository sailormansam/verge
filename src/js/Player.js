var Player = function (game) {
	this.game = game;
	this.sprite;
	
	this.create();
}

Player.prototype = {
	create: function () {
		// create player
		var graphics = game.add.graphics(0, 0);
		
		graphics.beginFill(0x333333);
		graphics.drawRect(0, 0, 20, 40);
		
		this.sprite = game.add.sprite(200, 200, graphics.generateTexture());
		graphics.destroy();
	},
	update: function () {
	
	}
}