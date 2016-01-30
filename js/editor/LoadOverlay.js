var LoadOverlay = function (parent) {
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
	bubbleGroup.x = i * 60 + 200;
	bubbleGroup.y = 150;

	// create bubble
	var bubble = game.add.sprite(0, 0, 'bubble');
	bubble.inputEnabled = true;
	bubble.events.onInputDown.add(function(){ this.UI.editor.canvas.loadLevel(i) }, this);
	bubble.input.priorityID = 4;
	bubble.input.useHandCursor = true;
	bubbleGroup.add(bubble);

	// level number
	var levelText = game.add.text(bubble.width / 2, bubble.height / 2 + 3, i, textStyle['normal']);
	levelText.anchor.set(0.5);
	bubbleGroup.add(levelText)

	this.add(bubbleGroup);
};