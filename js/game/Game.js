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
		game.physics.arcade.collide(this.player, this.map.collision);

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
		if(this.player.body.y > game.world.height + this.map.WORLD_PADDING_BOTTOM + this.player.height && !this.player.dead) {
			
			// shake screen
			game.camera.follow(null);
			var t = game.add.tween(game.camera)
                .to( { x: game.camera.x + 5, y: game.camera.y + 10 }, 50, Phaser.Easing.Linear.None)
                .to( { x: game.camera.x - 10, y: game.camera.y - 20  }, 50, Phaser.Easing.Linear.None);
            
            t.repeatAll(1);
			t.start();
			
			t.onComplete.add(function(){
				this.map.createCurrentLevel();
			}, this);
            
            this.player.dead = true;
		}
	}
};
