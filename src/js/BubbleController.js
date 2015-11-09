var BubbleController = function () {
	this.bubbles;
	this.angle;
	
	this.create();
};

BubbleController.prototype = {
	create: function () {
		// set variables
		this.bubbles = [];
		this.angle = 0;
	},
	
	add: function (bubble) {
		// add bubble to bubbles array
		this.bubbles.push(bubble);
		
		// calculate bubbles positions based on bubble array
		this.angle = 2 * Math.PI / this.bubbles.length;
	},
	
	show: function (pointer) {
		// show all bubbles and calculate positions
		for(var i = 0, len = this.bubbles.length; i < len; i++) {
			this.bubbles[i].show(i * this.angle - Math.PI / 2, pointer);
		}
	},
	
	hide: function () {
		// hide all bubbles
		this.bubbles.forEach(function (bubble) {
			bubble.hide();
		});
	}
};