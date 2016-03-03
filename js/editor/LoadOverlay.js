var LoadOverlay = function (parent) {
	// properties
	this.UI = parent;
	
	Overlay.call(this, parent);
    
	for(var i = 0, len = this.UI.editor.data.levels.length; i < len; i++) {
		this.createLevelBubble(i);
	}
	
	// load level text
	var loadText = game.add.text(game.width * .5, 100, 'LOAD LEVEL', textStyle['large']);
	loadText.anchor.set(0.5);
	this.add(loadText);
	
	this.visible = false;
	this.UI.overlayLayer.add(this);
};

LoadOverlay.prototype = Object.create(Overlay.prototype);
LoadOverlay.prototype.constructor = LoadOverlay;

LoadOverlay.prototype.createLevelBubble = function (i) {
	var bubbleGroup = game.add.group();
    
    var newLine = Math.floor(i / 4);
    
	bubbleGroup.x = (i - (newLine * 4)) * 60 + 225;
	bubbleGroup.y = 180 + newLine * 70;

	// create bubble
	var bubble = game.add.sprite(0, 0, 'bubble');
	bubble.inputEnabled = true;
	bubble.events.onInputDown.add(function(){ 
        this.UI.editor.canvas.loadLevel(i);          
        game.add.tween(bubble.scale).to({ x: 1.1, y: 1.1}, 100, Phaser.Easing.Quadratic.Out).to({ x: 1, y: 1}, 120, Phaser.Easing.Bounce.Out, true);
    }, this);
	bubble.input.priorityID = 4;
	bubble.input.useHandCursor = true;
    bubble.anchor.set(0.5);
	bubbleGroup.add(bubble);

	// level number
	var levelText = game.add.text(0, 3, i, textStyle['normal']);
	levelText.anchor.set(0.5);
	bubbleGroup.add(levelText)

	this.add(bubbleGroup);
};