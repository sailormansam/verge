var RotationOverlay = function (parent) {
	// properties
	this.UI = parent;
    this.rotationGraphics;
    this.rot;
    this.grab = false;
    this.grabAngle = 0;
    this.radians = 0;
    
	Overlay.call(this, parent);
    
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
    var centerPoint = new Phaser.Point(game.width / 2, game.height / 2);
    
    // Only rotate when dragging
    if(game.input.activePointer.leftButton.isDown) {
         // get initial mouse position relative to arm
        if(!this.grab) {
            this.grabAngle = this.radians - Math.atan2(game.input.y - centerPoint.y, game.input.x - centerPoint.x);
            this.grab = true;
        }
        
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
        var newCenterPoint = new Phaser.Point();
        newCenterPoint.x = Math.cos(this.radians) * 50 + centerPoint.x;
        newCenterPoint.y = Math.sin(this.radians) * 50 + centerPoint.y;
        this.rotationGraphics.lineTo(newCenterPoint.x, newCenterPoint.y);
        
        // update angle text
        this.radians = Math.atan2(game.input.y - centerPoint.y, game.input.x - centerPoint.x) + this.grabAngle;
        var angle = this.radians * (180 / Math.PI);
        this.rotationText.text = angle.toFixed(0) + '°';

        // draw arc
        this.rotationGraphics.lineStyle(5, 0xf1f1f1);

        var antiClockwise = true;

        // arc rotation direction
        if (this.radians > 0) {
            antiClockwise = false;
        }

        // save angle
        this.rot = angle.toFixed(0);
        
        // save rotation
        this.UI.editor.canvas.rot = this.rot;

        // display arc
        this.rotationGraphics.arc(centerPoint.x, centerPoint.y, 100, 0, this.radians, antiClockwise);
    }
    else {
        this.grab = false;
        this.grabAngle = 0;
    }
};