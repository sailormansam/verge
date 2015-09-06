var Teleporter = function (x, y, mapGrain) {
	// align to zero
    x += 0.5;
    y += 0.5;
    
    this.sprite;
	this.width = mapGrain;
	this.height = mapGrain;
	this.x = x * this.width;
	this.y = y * this.height;
	
	this.create();
}

Teleporter.prototype = {
	create: function () {
		// create player
		var graphics = game.add.graphics(0, 0);
		
		graphics.beginFill(0xff0000);
		graphics.drawRect(0, 0, this.width, this.height);
		
		this.sprite = game.add.sprite(this.x, this.y, graphics.generateTexture());
		graphics.destroy();
		
		// center sprite to align with map grid (physics objects are centered by default)
		this.sprite.anchor.set(0.5);
	}
}