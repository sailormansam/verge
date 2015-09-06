var Block = function (x, y, mapGrain, blockType) {
    // align to zero
    x += 0.5;
    y += 0.5;
    
	this.sprite;
	this.width = mapGrain;
	this.height = mapGrain;
	this.x = x * this.width;
	this.y = y * this.height;
    this.type = blockType;
	
	this.create();
}

Block.prototype = {
	create: function () {
		// create player
		var graphics = game.add.graphics(0, 0);
		
        if(this.type == blockType.STATIC) {
		  graphics.beginFill(0x666666);
        }
        else {
		  graphics.beginFill(0x999999);
        }
        
		graphics.drawRect(0, 0, this.width, this.height);
		
		this.sprite = game.add.sprite(this.x, this.y, graphics.generateTexture());
		graphics.destroy();
		
		// enable physics
		game.physics.p2.enable(this.sprite);
		
		// make sure block doesn't move
		this.sprite.body.dynamic = false;
	}
}