var Overlay = function (parent) {
	Phaser.Group.call(this, game);
	game.add.existing(this);
	
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