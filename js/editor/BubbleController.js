var BubbleController = function () {
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
		this.angle = 2 * Math.PI / this.bubbles.length;
	},
	
	show: function (pointer) {
		// show all bubbles and calculate positions
		for(var i = 0, len = this.bubbles.length; i < len; i++) {
			this.bubbles[i].show(i * this.angle - Math.PI / 2, new Phaser.Point(80, 80));
		}
		
		this.showing = true;
	},
	
	hide: function () {
		// hide all bubbles
		this.bubbles.forEach(function (bubble) {
			bubble.hide();
		});
		
		this.showing = false;
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