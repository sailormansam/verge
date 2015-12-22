var BubbleController = function () {
	this.bubbles;
	this.angle;
	this.showing;
	
	this.create();
};

BubbleController.prototype = {
	create: function () {
		// set variables
		this.bubbles = [];
		this.angle = 0;
		this.showing = false;
	},
	
	add: function (bubble) {
		// add bubble to bubbles array
		this.bubbles.push(bubble);
		
		// calculate bubbles positions based on bubble array
//		this.angle = 2 * Math.PI / this.bubbles.length;
		this.angle = Math.PI / 3;
	},
	
	show: function (pointer) {
		// show all bubbles and calculate positions
		for(var i = 0, len = this.bubbles.length; i < len; i++) {
			this.bubbles[i].show(i * this.angle - Math.PI / 2, pointer);
		}
		
		this.showing = true;
	},
	
	hide: function () {
		// hide all bubbles
		this.bubbles.forEach(function (bubble) {
			bubble.hide();
		});
		
		this.showing = false;
	}
};