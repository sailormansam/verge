var time;

var Timer = function (game, x, y) {
	this.game = game;
	this.visual;
	this.x = x;
	this.y = y;
	
	this.create();
}

Timer.prototype = {
	create: function () {
		time = 0;
		
		this.visual = this.game.add.text(this.x, this.y, '0', textStyle['large']);
		this.visual.anchor.set(0.5, 0);
		this.visual.fixedToCamera = true;
	},
	update: function (dt) {
		time += dt;
		var format = time / 1000;
		this.visual.text = format.toFixed(0).toString();
	}
}