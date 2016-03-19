var Block = function (gameState, x, y, mapGrain, material) {
	// align to zero
	this.gameState = gameState;
	this.material = material;
    this.mapGrain = mapGrain;
	
	// create block
	var graphics = game.add.graphics(0, 0);

	if(this.material == blockType.STATIC) {
		graphics.beginFill(0x12738A);
		
	}
	else {
		graphics.beginFill(0xE6D645);
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
    if(this.material == blockType.DYNAMIC) {
        this.scale.set(0);
        
        // tween
        var t = game.add.tween(this.scale)
            .to( { x: 1.2, y: 1.2 }, 100, Phaser.Easing.Quadratic.Out)
            .to( { x: 1, y: 1  }, 50, Phaser.Easing.Quadratic.In);

        t.start();

        t.onComplete.add(function(){
            // enable physics
            game.physics.arcade.enable(this);
            this.body.allowGravity = false;
            this.body.immovable = true;
        }, this);
    }
};