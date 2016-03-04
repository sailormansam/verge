var Player = function (gameState, x, y) {
	// create player
	var graphics = game.add.graphics(0, 0);

	graphics.beginFill(0xffffff);
	graphics.drawRect(0, 0, 25, 40);
	
	Phaser.Sprite.call(this, game, x, y, graphics.generateTexture());
	
	graphics.destroy();
	
    this.anchor.set(0.5);
    
	this.gameState = gameState;
	this.canJump = false;
	this.canMove = false;
	this.jumpKeyUp = false;
	this.continueJump = false;
	
	this.ACCELERATION = 50;
	this.MAX_SPEED = 300;
	this.JUMP = -400;
	this.IN_AIR_SPEED = 0.3;
	
	game.add.existing(this);
	
	this.create();
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function () {

	// enable physics
    game.physics.arcade.enable(this);

	// set up inventory
	this.inventory = new Inventory();
};

Player.prototype.preRender = function () {
	// update inventory
	this.inventory.preRender(this);
};

Player.prototype.update = function () {
	this.move();

	// reset jump if key is up
	if(!game.input.keyboard.isDown(Phaser.Keyboard.W)
	   && !game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
		this.jumpKeyUp = true;
	}
	else {
		this.jumpKeyUp = false;
	}
};

Player.prototype.move = function () {
	var multiplier = 1;
	
	// in the air
	if(!this.canJump) {
		multiplier = this.IN_AIR_SPEED;
	}
	if(this.canMove) {
		// move left and right
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)
		   || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			this.body.velocity.x += -this.ACCELERATION * multiplier;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D)
			   || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			this.body.velocity.x += this.ACCELERATION * multiplier;
		}
        else {
            this.body.velocity.x *= 0.9;
        }

		// check for max speed
		if(this.body.velocity.x > this.MAX_SPEED) {
			this.body.velocity.x = this.MAX_SPEED;
		}
        
        if(this.body.velocity.x < -this.MAX_SPEED) {
			this.body.velocity.x = -this.MAX_SPEED;
		}
        
		// jump
		if((game.input.keyboard.isDown(Phaser.Keyboard.W)
		  || game.input.keyboard.isDown(Phaser.Keyboard.UP))
		  && ((this.canJump && this.jumpKeyUp) || this.continueJump)) {
			this.body.velocity.y = this.JUMP;

//				if(this.canJump) {
//					this.doParticles();
//				}

			this.canJump = false;
			this.continueJump = true;
			game.time.events.add(Phaser.Timer.SECOND / 4, this.stopJump, this).autoDestroy = true;


			// start jump animation
			var t = game.add.tween(this.scale).to({ x: 0.7, y: 1.3}, 100, Phaser.Easing.Quadratic.Out)
													 .to({ x: 1, y: 1}, 120, Phaser.Easing.Bounce.Out);
			t.start();
		}
	}
};

Player.prototype.stopJump = function () {
	this.continueJump = false;
};

Player.prototype.moveToStart = function (x, y) {
	this.body.x = x;
	this.body.y = y;

	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
};

Player.prototype.checkJump = function () {
	if(!this.canJump) {
		this.doParticles();
        var t = game.add.tween(this.scale).to({ x: 1, y: 0.9}, 100, Phaser.Easing.Quadratic.Out)
													 .to({ x: 1, y: 1}, 120, Phaser.Easing.Bounce.Out);
			t.start();
	}

	// allow another jump if the jump key is no longer down
	this.canJump = true;
	this.canMove = true;
};

Player.prototype.doParticles = function () {
	// emit a little particle effect for jumping and landing
	// emitter for the left side of the player
	emitterLeft = game.add.emitter(this.x + 20, this.body.y + this.height, 20);

	emitterLeft.makeParticles('block');

	emitterLeft.setXSpeed(0, 0);
	emitterLeft.setYSpeed(-120, -120);

	emitterLeft.bringToTop = true;
	emitterLeft.setRotation(0, 0);
	emitterLeft.setAlpha(1, 1, 500);
	emitterLeft.setScale(0.2, 0.25, 0.2, 0.25, 500);
	emitterLeft.gravity = -50;

	emitterLeft.start(true, 300, null, 1);

	// emitter for the right side of the player
	emitterRight = game.add.emitter(this.x - 20, this.body.y + this.height, 20);

	emitterRight.makeParticles('block');

	emitterRight.setXSpeed(0, 0);
	emitterRight.setYSpeed(-120, -120);

	emitterRight.bringToTop = true;
	emitterRight.setRotation(0, 0);
	emitterRight.setAlpha(1, 1, 500);
	emitterRight.setScale(0.2, 0.25, 0.2, 0.25, 500);
	emitterRight.gravity = -50;

	emitterRight.start(true, 300, null, 1);
};