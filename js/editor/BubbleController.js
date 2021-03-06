var BubbleController = function (toolTipManager) {
    this.toolTips = toolTipManager;
	this.bubbles;
	this.angle;
	this.showing;
	this.currentAction;
	this.hidden;
	
	this.create();
	this.bubbleLayer = game.add.group();
};

BubbleController.prototype = {
	create: function () {
		// set variables
		this.bubbles = [];
		this.angle = 0;
		this.showing = false;
		this.currentAction = null;
		this.hidden = true;
	},
	
	add: function (bubble) {
		// add bubble to bubbles array
		this.bubbles.push(bubble);
		
		this.bubbleLayer.add(bubble);
		
		// calculate bubbles positions based on bubble array
		this.angle = (Math.PI / 2) / (this.bubbles.length - 1);
	},
	
	show: function (pointer) {
		// show all bubbles and calculate positions
		for(var i = 0, len = this.bubbles.length; i < len; i++) {
			this.bubbles[i].show(i * this.angle, new Phaser.Point(40, 40));
		}
		
		this.showing = true;
        
        // clear tool tips
        this.toolTips.clearTimer();
	},
	
	hide: function () {
		// hide all bubbles
		this.bubbles.forEach(function (bubble) {
			bubble.hide();
		});
		
		this.showing = false;
        
        // clear tool tips
        this.toolTips.clearTimer();
	},
	
	setActive: function (bubble) {
		for(var i = 0, len = this.bubbles.length; i < len; i++) {
			this.bubbles[i].active = false;
		}
		
		// set current action
		this.currentAction = bubble.action;
		
		// bring bubble to top of all the other bubbles
		this.bubbleLayer.bringToTop(bubble);
		
		bubble.active = true;
	}
};