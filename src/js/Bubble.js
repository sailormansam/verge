var Bubble = function (image, distanceFromPointer) {
	this.image = image;
	this.origin = new Phaser.Point(20, 20);
	this.distanceFromPointer = distanceFromPointer;
	this.origin;
	this.desiredLocation;
	this.showing = false;
	this.velocity = new Phaser.Point(0, 0);
	this.k = 0.5;
	
	// create background
	var graphics = game.add.graphics(0, 0);

	graphics.beginFill(0x999999);
	graphics.drawCircle(0, 0, 25);
	
	Phaser.Sprite.call(this, game, this.origin.x, this.origin.y, graphics.generateTexture());
	
	graphics.destroy();

	// create foreground image
	
	// on click
	
	game.add.existing(this);
};

Bubble.prototype = Object.create(Phaser.Sprite.prototype);
Bubble.prototype.constructor = Bubble;

Bubble.prototype.update = function () {
	if(this.showing) {
		// set current point
		var currentPoint = new Phaser.Point(this.x, this.y);
		
		// calculate acceleration for x and y
		var ax = -this.k * Math.abs(desiredLocation.x - currentPoint.x);
		var ay = -this.k * Math.abs(desiredLocation.y - currentPoint.y);
		
		// add to velocity
		this.velocity.x += ax;
		this.velocity.y += ay;
		
		// add to position
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		
		// set scale based on distance to desiredLocation
		var originDistance = this.origin.distance(this.currentPoint);
		var currentDistance = this.currentPoint.distance(this.desiredLocation);
		this.scale.set(currentDistance / originDistance);
	}
};

Bubble.prototype.show = function (angle, pointer) {
	this.showing = true;
	
	// set points to control spring
	this.origin = new Phaser.Point(pointer.x, pointer.y);
	this.desiredLocation = new Phaser.Point(origin.x + distanceFromPointer * Math.cos(angle),
											origin.y + distanceFromPointer * Math.sin(angle));
	
	// set to origin
	this.x = origin.x;
	this.y = origin.y;
};

Bubble.prototype.hide = function () {
	// pop out bubble
};