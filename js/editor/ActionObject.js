var ActionObject = function (image) {
	Phaser.Sprite.call(this, game, 0, 0, image);
	game.add.existing(this);
};

ActionObject.prototype = Object.create(Phaser.Sprite.prototype);
ActionObject.prototype.constructor = ActionObject;