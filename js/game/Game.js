GameStates.Game = function (game) {
	// properties
	this.player;
	this.map;
	this.teleporter;
	this.timer;
	this.pointerController;
    this.dyingTimer;
	
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
        
        
        this.spriter = game.add.sprite(0, 0);
		
		// make level
		this.map = new Map(this);
		this.map.createCurrentLevel();
		
		// create pointer controller
		this.pointerController = new PointerController(this);
		
        // hide layer
        this.hideLayer = game.add.group();
        
        // set up background color to hide actual game
        var graphics = game.add.graphics(0, 0);

        graphics.beginFill(0x4AC5D0);
        graphics.drawRect(0, 0, game.width, game.height);
        
        this.background = game.add.sprite(0, 0, graphics.generateTexture());
        
        graphics.destroy();
		
		// set up gameplay timer
        this.frontLayer = game.add.group();
		this.timer = new Timer(game, game.width - 60, 20);
        
        this.textitup = new Phaser.RenderTexture(game, game.world.width, game.world.height);
        
        this.spriter.angle = -5;
        
        this.frontLayer.add(this.spriter);
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
			// emitter for the right side of the player
            var emitter = game.add.emitter(this.player.body.x, this.camera.y + this.game.height);

            emitter.makeParticles('block');

            emitter.bringToTop = true;
            emitter.setRotation(0, 0);
            emitter.setAlpha(1, 1, 500);
            emitter.setScale(0.2, 0.25, 0.2, 0.25, 500);
            emitter.setYSpeed(-150, -420);

            emitter.start(true, 300, null, 10);
            
            
			// shake screen
			var t = game.add.tween(game.camera)
                .to( { x: game.camera.x + 5, y: game.camera.y + 10 }, 50, Phaser.Easing.Linear.None)
                .to( { x: game.camera.x - 5, y: game.camera.y - 10  }, 50, Phaser.Easing.Linear.None);
            
            t.repeatAll(2);
			t.start();
			
			t.onComplete.add(function(){
                this.map.createCurrentLevel();
			}, this);
            
            this.player.dead = true;
		}
        
        // hide background so we can take a shot of the game
        this.background.alpha = 0;
        this.timer.visual.alpha = 0;
        
        // render world to sprite
        this.textitup.renderXY(game.world, 0, 0, true);
        this.spriter.loadTexture(this.textitup);
        
        // cover the actual game up
        this.background.alpha = 1;
        this.timer.visual.alpha = 1;
        
        // update 'camera'
        this.spriter.x = -this.player.x + game.height / 2;
        this.spriter.y = -this.player.y + game.width / 2;
	}
};
