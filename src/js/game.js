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
		
		for(var i = 0, len = map.level[this.level].block.length; i < len; i++) {
			this.block.push(new Block(map.level[this.level].block[i].x * this.mapGrain,
									  map.level[this.level].block[i].y * this.mapGrain,
									  this.mapGrain));
		}
		
		// set the world bounds based on level
		game.world.setBounds(0, 0, map.level[this.level].block[i - 1].x * this.mapGrain, game.height);
		
		// camera
		game.camera.follow(this.player.sprite);
	},
	update: function () {
		this.player.update();
	}
};