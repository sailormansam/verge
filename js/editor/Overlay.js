var Overlay = function (parent) {
	Phaser.Group.call(this, game);
	game.add.existing(this);
    
    // add background
	var graphics = game.add.graphics(0, 0);
	graphics.beginFill(0xffffff);
	graphics.drawRect(0, 0, game.width, game.height);

	var background = game.add.sprite(0, 0, graphics.generateTexture());
	background.alpha = 0.65;

	graphics.destroy();

	this.add(background);
    
    // add close button
    this.closeButton = game.add.sprite(game.width - 80, 80, 'close');
	this.closeButton.inputEnabled = true;
    this.closeButton.events.onInputDown.add(this.hide, this);
    this.closeButton.input.priorityID = 3;
    this.closeButton.anchor.set(0.5);
    this.closeButton.input.useHandCursor = true;
    
    this.add(this.closeButton);
    
	// properties
	this.UI = parent;
};

Overlay.prototype = Object.create(Phaser.Group.prototype);
Overlay.prototype.constructor = Overlay;

Overlay.prototype.show = function () {
	// show overlay
	this.visible = true;
	this.UI.overlayLayer.alpha = 0;
	this.UI.overlayLayer.visible = true;
	game.add.tween(this.UI.overlayLayer.cameraOffset).to({ y: 0 }, 250, Phaser.Easing.Quadratic.Out, true);
	game.add.tween(this.UI.overlayLayer).to({ alpha: 1 }, 250, Phaser.Easing.Quadratic.Out, true);

	this.UI.UIUp = false;
	this.UI.overlayActive = true;
};

Overlay.prototype.hide = function () {
	// hide overlay
	this.UI.overlayLayer.alpha = 1;

	game.add.tween(this.UI.overlayLayer.cameraOffset).to({ y: 25 }, 250, Phaser.Easing.Quadratic.In, true);
	var tween = game.add.tween(this.UI.overlayLayer).to({ alpha: 0 }, 250, Phaser.Easing.Quadratic.In, true);

	tween.onComplete.add(function(){
		this.UI.overlayLayer.visible = false;
		this.UI.overlayActive = false;
		this.UI.upUI();
		this.visible = false;
	}, this);
};