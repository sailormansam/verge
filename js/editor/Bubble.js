var Bubble = function (parent, action, distanceFromPointer) {
	this.bubbleController = parent.bubbleController;
	this.origin = new Phaser.Point(80, 80);
	this.showing = false;
	this.distanceFromPointer = distanceFromPointer;
	this.desiredLocation = new Phaser.Point(80, 80);
	this.velocity = new Phaser.Point(0, 0);
	this.k = 300;
	this.dampening = 0.7;
	this.action = action;
	this.active = false;
	
	// call group which this extends
	Phaser.Group.call(this, game);
	game.add.existing(this);
	
	// set origin to actual loctaion
	this.x = this.origin.x;
	this.y = this.origin.y;

	// create foreground image
	this.background = game.add.sprite(0, 0, 'bubble');
	this.foreground = game.add.existing(action.sprite);
	
	// add background and foreground
	this.add(this.background);
	this.add(this.foreground);
	
	this.background.anchor.set(0.5);
	this.foreground.anchor.set(0.5);
	this.foreground.scale.set(0.5);
	
	// on click
	this.background.inputEnabled = true;
	this.background.input.useHandCursor = true;
	this.background.events.onInputUp.add(this.up, this);
	this.background.input.priorityID = 2;
	
	this.hide();
};

Bubble.prototype = Object.create(Phaser.Group.prototype);
Bubble.prototype.constructor = Bubble;

Bubble.prototype.update = function () {
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
	this.x += (this.velocity.x * game.time.elapsedMS / 1000);
	this.y += (this.velocity.y * game.time.elapsedMS / 1000);

	currentPoint.x = this.x;
	currentPoint.y = this.y;

	// set scale based on distance to desiredLocation
	var originDistance = this.origin.distance(this.desiredLocation);

	// invert for hiding
	if(!this.active) {
		if(this.showing) {
			var currentDistance = this.origin.distance(currentPoint);
		}
		else {
			var currentDistance = this.desiredLocation.distance(currentPoint);
		}
		

		// cap scale
		var scale = currentDistance / originDistance;
		if(scale > 1.3) {
			scale = 1.3
		}

		if (scale < 0 || isNaN(scale)) {
			scale = 0;
		}

		this.scale.set(scale);
		
		var alpha = currentDistance / originDistance;

		if(alpha > 1)
			alpha = 1;

		if(alpha < .1 || isNaN(alpha)) {
			alpha = 0;
			this.background.visible = false
		}
		else {
			this.background.visible = true;
		}

		this.alpha = alpha;
	}
};

Bubble.prototype.click = function () {
	if(this.showing) {
		console.log('bubble click', this.action);
		this.bubbleController.setActive(this);
		this.bubbleController.hide();
	}
	else {
		console.log('bubble click', this.action);
		this.bubbleController.show();
	}
};

Bubble.prototype.up = function () {
	// this.showing gets set to its intended value before this point
	if(this.showing) {
		this.bubbleController.hidden = false;
	}
	else {
		this.bubbleController.hidden = true;
	}
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