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
		game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.physics.arcade.gravity.y = this.GRAVITY;
		
		// make level
		this.map = new Map(this);
		this.map.createCurrentLevel();
		
		// create pointer controller
		this.pointerController = new PointerController(this);
		
		// set up jump event for player scope callback function to player
		
		// set up gameplay timer
		this.timer = new Timer(game, game.width - 60, 20);
	},
	
	preRender: function () {
		this.pointerController.preRender();
	},
	
	update: function () {
        // update physics
        game.physics.arcade.collide(this.player, this.map.collidableBlocks);
        
        if(this.player.body.touching.down) {
            this.player.checkJump();
        }
        
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
