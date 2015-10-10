var blockType = {
	STATIC: "STATIC",
	DYNAMIC: "DYNAMIC"
}

GameStates.Game = function (game) {
	// properties
	this.player;
	this.map;
	this.teleporter;
	this.timer;
	this.pointerController;
	
	// collison layers
	this.playerCollisionGroup;
	this.blockCollisionGroup;
	
	// constants
	this.GRAVITY = 1000;
};

GameStates.Game.prototype = {
	create: function () {
		// reset variables
		this.player = null;
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 1;
		game.physics.p2.gravity.y = this.GRAVITY;
		game.physics.p2.damping = 1;
		
		// turn on collision callbacks with collision groups
		game.physics.p2.setImpactEvents(true);
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
		this.blockCollisionGroup = game.physics.p2.createCollisionGroup();
		
		// make level
		this.map = new Map(this);
		
		// create pointer controller
		this.pointerController = new PointerController(this);
		
		// set up jump event for player scope callback function to player
		this.player.body.collides(this.blockCollisionGroup, this.player.checkJump, this.player);
		
		// set up gameplay timer
		this.timer = new Timer(game, game.width - 60, 20);
	},
	
	preRender: function () {
		this.pointerController.preRender();
	},
	
	update: function () {
		// incremement timer
		this.timer.update(game.time.elapsedMS);
		
		this.pointerController.update();
		
		// check for collision with teleporter
		if(Phaser.Rectangle.intersects(this.player.getBounds(), this.teleporter.getBounds())) {
			// go to next level if there is one
			if(this.map.hasNextLevel()) {
				this.map.incrementLevel();
				this.map.createCurrentLevel();
				this.player.canMove = false;
			}
			else {
				game.state.start('GameOver');
			}
		}
		
		// check if player falls too far to reset level
		if(this.player.body.y > game.world.height + this.map.WORLD_PADDING_BOTTOM + this.player.height) {
			this.map.createCurrentLevel();
		}
	}
};
