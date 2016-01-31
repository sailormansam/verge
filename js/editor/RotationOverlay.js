var RotationOverlay = function (parent) {
	// properties
	this.UI = parent;
	
	Overlay.call(this, parent);
	
	var graphics = game.add.graphics(0, 0);
	graphics.beginFill(0xffffff);
	graphics.drawRect(0, 0, game.width, game.height);

	var background = game.add.sprite(0, 0, graphics.generateTexture());
	background.alpha = 0.65;
	background.inputEnabled = true;
	background.input.priorityID = 3;
	background.events.onInputDown.add(function(){
		this.hide();
	}, this);

	graphics.destroy();

	this.add(background);
	
	// load level text
	var text = game.add.text(game.width * .5, 100, 'ROTATION', textStyle['large']);
	text.anchor.set(0.5);
	this.add(text);
	
	this.visible = false;
	this.UI.overlayLayer.add(this);
};

RotationOverlay.prototype = Object.create(Overlay.prototype);
RotationOverlay.prototype.constructor = RotationOverlay;