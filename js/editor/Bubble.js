var Bubble = function (parent, action, distanceFromPointer) {
	this.editor = parent;
	this.origin = new Phaser.Point(0, 0);
	this.distanceFromPointer = distanceFromPointer;
	this.showing = false;
	this.desiredLocation = new Phaser.Point(0, 0);
	this.velocity = new Phaser.Point(0, 0);
	this.k = 300;
	this.dampening = 0.7;
	this.action = action;
	
	// create background
	var graphics = game.add.graphics(0, 0);

	graphics.beginFill(0x999999);
	graphics.drawCircle(0, 0, 45);
	
	
	Phaser.Group.call(this, game);
	game.add.existing(this);

	// create foreground image
	this.foreground = game.add.existing(action.sprite);
	this.background = game.add.sprite(0, 0, graphics.generateTexture());
	
	this.add(this.foreground);
	this.add(this.background);
	graphics.destroy();
	
	this.foreground.bringToTop();
	
	this.scale.set(0);
	
	this.background.anchor.set(0.5);
	this.foreground.anchor.set(0.5);
	this.foreground.scale.set(0.5);
	
	// on hover
	this.background.inputEnabled = true;
	this.background.input.useHandCursor = true;
	this.background.events.onInputOver.add(this.highlight, this);
	this.background.events.onInputOut.add(this.leave, this);
	this.background.events.onInputDown.add(this.click, this);
	this.background.input.priorityID = 2;
	// on click
	
	this.hide();
	
};

Bubble.prototype = Object.create(Phaser.Group.prototype);
Bubble.prototype.constructor = Bubble;

Bubble.prototype.update = function () {
	if(this.origin) {
		// set current point
		var currentPoint = new Phaser.Point(this.x, this.y);

		// calculate acceleration for x and y
		var ax = -this.k * (currentPoint.x - this.desiredLocation.x);
		var ay = -this.k * (currentPoint.y - this.desiredLocation.y);

		// add to velocity
		this.velocity.x += ax * game.time.elapsedMS / 1000;
		this.velocity.x *= this.dampening;
		this.velocity.y += ay * game.time.elapsedMS / 1000;
		this.velocity.y *= this.dampening;

		// add to position
		this.x += this.velocity.x * game.time.elapsedMS / 1000;
		this.y += this.velocity.y * game.time.elapsedMS / 1000;

		currentPoint.x = this.x;
		currentPoint.y = this.y;

		// set scale based on distance to desiredLocation
		var originDistance = this.origin.distance(this.desiredLocation);

		// invert for hiding
		if(this.showing) {
			var currentDistance = this.origin.distance(currentPoint);
		}
		else {
			var currentDistance = this.desiredLocation.distance(currentPoint);
//			console.log(currentDistance);
		}

		this.scale.set(currentDistance / originDistance);

		var alpha = currentDistance / originDistance;

		if(alpha > 1)
			alpha = 1;

		if(alpha < 0)
			alpha = 0;

		this.alpha = alpha;

		// update foreground image with an action object image
	}
};

Bubble.prototype.click = function () {
	this.editor.currentAction = this.action;
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
	this.showing = false;
	this.desiredLocation = new Phaser.Point(this.origin.x, this.origin.y);
	this.origin = new Phaser.Point(this.x, this.y);
};

Bubble.prototype.highlight = function () {
	var graphics = game.add.graphics(0, 0);

	graphics.beginFill(0x333333);
	graphics.drawCircle(0, 0, 45);
	
	this.background.loadTexture(graphics.generateTexture());
	
	graphics.destroy();
};

Bubble.prototype.leave = function () {
	var graphics = game.add.graphics(0, 0);

	graphics.beginFill(0x999999);
	graphics.drawCircle(0, 0, 45);
	
	this.background.loadTexture(graphics.generateTexture());
	
	graphics.destroy();
};