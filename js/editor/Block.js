var Block = function (x, y, key, material) {
	this.material = material;
	Phaser.Sprite.call(this, game, x, y, key, material);
	game.add.existing(this);
};

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;