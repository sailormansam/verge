var Bubble = function (image, distanceFromPointer) {
	this.image = image;
	this.origin = new Phaser.Point(20, 20);
	this.distanceFromPointer = distanceFromPointer;
	this.origin;
	this.desiredLocation;
	this.showing = false;
	this.velocity = new Phaser.Point(0, 0);
	this.k = 0.01;
	
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
		var ax = -this.k * (currentPoint.x - this.desiredLocation.x);
		var ay = -this.k * (currentPoint.y - this.desiredLocation.y);
		
		// add to velocity
//		game.time.elapsedMS
		this.velocity.x += ax;
		this.velocity.y += ay;
		
		// add to position
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		
		currentPoint.x = this.x;
		currentPoint.y = this.y;
		
		// set scale based on distance to desiredLocation
		var originDistance = this.origin.distance(this.desiredLocation);
		var currentDistance = this.origin.distance(currentPoint);
		this.scale.set(currentDistance / originDistance);
	}
	
	// update foreground image
};

Bubble.prototype.show = function (angle, pointer) {
	this.showing = true;
	this.velocity.x = 0;
	this.velocity.y = 0;
	
	// set points to control spring
	this.origin = new Phaser.Point(pointer.x, pointer.y);
	this.desiredLocation = new Phaser.Point(this.origin.x + this.distanceFromPointer * Math.cos(angle),
											this.origin.y + this.distanceFromPointer * Math.sin(angle));
	
	// set to origin
	this.x = this.origin.x;
	this.y = this.origin.y;
};

Bubble.prototype.hide = function () {
	// pop out bubble
};