var RotationOverlay = function (parent) {
	// properties
	this.UI = parent;
    this.rotationGraphics;
    this.rot;
    
	Overlay.call(this, parent);
	
	var graphics = game.add.graphics(0, 0);
	graphics.beginFill(0xffffff);
	graphics.drawRect(0, 0, game.width, game.height);

	var background = game.add.sprite(0, 0, graphics.generateTexture());
	background.alpha = 0.65;
	background.inputEnabled = true;
	background.input.priorityID = 3;
	background.events.onInputDown.add(function(){
        this.UI.editor.canvas.rot = this.rot;
		this.hide();
	}, this);

	graphics.destroy();

	this.add(background);
    
    // add rotation measure
	this.rotationGraphics = game.add.graphics(0, 0);
    this.add(this.rotationGraphics);
	
	// load level text
	var text = game.add.text(game.width * .5, 100, 'ROTATION', textStyle['large']);
	text.anchor.set(0.5);
	this.add(text);
    
    this.rotationText = game.add.text (game.width * .5, 150, 'angle', textStyle['normal']);
    this.rotationText.anchor.set(0.5);
    this.add(this.rotationText);
	
	this.visible = false;
	this.UI.overlayLayer.add(this);
};

RotationOverlay.prototype = Object.create(Overlay.prototype);
RotationOverlay.prototype.constructor = RotationOverlay;

RotationOverlay.prototype.update = function () {
    // clear graphics
    this.rotationGraphics.clear();
    
    // draw small circle for appearance
    this.rotationGraphics.beginFill(0x202529);
    this.rotationGraphics.lineStyle(0, 0x202529, 1);
    this.rotationGraphics.drawCircle(game.width / 2, game.height / 2, 5);
    this.rotationGraphics.endFill();
    
    // set line style
    this.rotationGraphics.lineStyle(5, 0x202529, 1);
    
    // draw base
    this.rotationGraphics.moveTo(game.width / 2, game.height / 2);
    this.rotationGraphics.lineTo(game.width / 2 + 50, game.height / 2);
    
    // draw angle
    this.rotationGraphics.moveTo(game.width / 2, game.height / 2);
    var centerPoint = new Phaser.Point(game.width / 2, game.height / 2);
    var mousePoint = new Phaser.Point(game.input.x, game.input.y);
    var vector = Phaser.Point.subtract(centerPoint, mousePoint);
    var vectorLength = Phaser.Point.distance(centerPoint, mousePoint);
    var normalized = Phaser.Point.divide(vector, new Phaser.Point(vectorLength, vectorLength));
    var multiplied = Phaser.Point.multiply(normalized, new Phaser.Point(50, 50));
    var newCenterPoint = Phaser.Point.subtract(centerPoint, multiplied);
    this.rotationGraphics.lineTo(newCenterPoint.x, newCenterPoint.y);
    
    // update angle text
    var radians = Math.atan2(game.input.y - centerPoint.y, game.input.x - centerPoint.x)
    var angle = radians * (180 / Math.PI);
    this.rotationText.text = angle.toFixed(0) + '°';
    
    // draw arc
    this.rotationGraphics.lineStyle(5, 0xf1f1f1);
    
    var antiClockwise = true;
    
    // arc rotation direction
    if (radians > 0) {
        antiClockwise = false;
    }
    
    // save angle
    this.rot = angle.toFixed(0);
    
    // display arc
    this.rotationGraphics.arc(centerPoint.x, centerPoint.y, 100, 0, radians, antiClockwise);
};