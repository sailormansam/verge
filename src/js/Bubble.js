var Bubble = function (image) {
	this.image = image;
	this.origin = new Phaser.Point(20, 20);
	this.displayPoint;
	
	// create background
	var graphics = game.add.graphics(0, 0);

	graphics.beginFill(0x999999);
	graphics.drawCircle(0, 0, 25);
	
	Phaser.Sprite.call(this, game, this.origin.x, this.origin.y, graphics.generateTexture());
	
	graphics.destroy();

	// create foreground image
	
	game.add.existing(this);
};

Bubble.prototype = Object.create(Phaser.Sprite.prototype);
Bubble.prototype.constructor = Bubble;

Bubble.prototype.show = function () {
	// pop in bubble
};

Bubble.prototype.hide = function () {
	// pop out bubble
};