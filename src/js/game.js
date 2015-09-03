GameStates.Game = function (game) {
	this.player = null;
	this.level = 0;
	this.block = [];
	
	this.GRAVITY = 1000;
	
	this.mapGrain = 40;	// size of map blocks
};

GameStates.Game.prototype = {
	create: function () {
		// enable physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 1;
		game.physics.p2.gravity.y = this.GRAVITY;
		game.physics.p2.damping = 1;
		
		// create player
		this.player = new Player();
		
		// create map
		var map = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
		
		for(var i = 0, len = map.level[0].block.length; i < len; i++) {
			this.block.push(new Block(map.level[0].block[i].x * this.mapGrain,
									  map.level[0].block[i].y * this.mapGrain,
									  this.mapGrain));
		}
	},
	update: function () {
		this.player.update();
	}
};