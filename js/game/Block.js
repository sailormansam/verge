var Block = function (gameState, x, y, mapGrain, material) {
	// align to zero
	this.gameState = gameState;
	this.material = material;
	
	// create block
	var graphics = game.add.graphics(0, 0);

	if(this.material == blockType.STATIC) {
		graphics.beginFill(0x666666);
		
	}
	else {
		graphics.beginFill(0x999999);
	}

	graphics.drawRect(0, 0, mapGrain, mapGrain);
	
	// call extending constructor
	Phaser.Sprite.call(this, game, x * mapGrain, y * mapGrain, graphics.generateTexture());
	game.add.existing(this);
	
	graphics.destroy();
	
	this.create();
}

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;

Block.prototype.create = function () {
	// enable physics
	game.physics.arcade.enable(this);
    this.body.allowGravity = false;
	this.body.immovable = true;
};