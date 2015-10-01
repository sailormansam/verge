var Player = function (parent, x, y) {
	this.parent = parent;
	this.sprite;
	this.x = x;
	this.y = y;
	this.width = 25;
	this.height = 40;
	this.canJump = false;
	this.canMove = false;
	this.jumpKeyUp = false;
	this.continueJump = false;
	
	this.ACCELERATION = 50;
	this.MAX_SPEED = 300;
	this.JUMP = -450;
	this.IN_AIR_SPEED = 0.3;
	
	this.create();
}

Player.prototype = {
	create: function () {
		// create player
		var graphics = game.add.graphics(0, 0);
		
		graphics.beginFill(0x333333);
		graphics.drawRect(0, 0, this.width, this.height);
		
		this.sprite = game.add.sprite(this.x, this.y, graphics.generateTexture());
		graphics.destroy();
		
		// enable physics
		game.physics.p2.enable(this.sprite);
		
		// player physics settings
		this.sprite.body.mass = 1;
		
		this.sprite.body.setCollisionGroup(this.parent.playerCollisionGroup);
		
		// set up inventory
		this.inventory = new Inventory(this.parent);
	},
	preRender: function () {
		// update inventory
		this.inventory.preRender(this);
	},
	update: function () {
		this.sprite.body.setZeroRotation();
		this.sprite.body.rotation = 0;
		
		this.move();
		
		// reset jump if key is up
		if(!game.input.keyboard.isDown(Phaser.Keyboard.W)
		   && !game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			this.jumpKeyUp = true;
		}
		else {
			this.jumpKeyUp = false;
		}
	},
	move: function () {
		var multiplier = 1;
		
		// in the air
		if(!this.canJump) {
			multiplier = this.IN_AIR_SPEED;
		}
		if(this.canMove) {
			// move left and right
			if(game.input.keyboard.isDown(Phaser.Keyboard.A)
			   || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
				this.sprite.body.velocity.x += -this.ACCELERATION * multiplier;
			}
			else if(game.input.keyboard.isDown(Phaser.Keyboard.D)
				   || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
				this.sprite.body.velocity.x += this.ACCELERATION * multiplier;
			}

			// check for max speed
			if(this.sprite.body.velocity.x > this.MAX_SPEED) {
				this.sprite.body.velocity.x = this.MAX_SPEED;
			}

			if(this.sprite.body.velocity.x < -this.MAX_SPEED) {
				this.sprite.body.velocity.x = -this.MAX_SPEED;
			}

			// jump
			if((game.input.keyboard.isDown(Phaser.Keyboard.W)
			  || game.input.keyboard.isDown(Phaser.Keyboard.UP))
			  && ((this.canJump && this.jumpKeyUp) || this.continueJump)) {
				this.sprite.body.velocity.y = this.JUMP;
				this.canJump = false;
				this.continueJump = true;
				game.time.events.add(Phaser.Timer.SECOND / 4, this.stopJump, this).autoDestroy = true;
				
				// start jump animation
				var t = game.add.tween(this.sprite.scale).to({ x: 0.9, y: 1.3}, 100, Phaser.Easing.Quadratic.In)
														 .to({ x: 1, y: 1}, 100, Phaser.Easing.Quadratic.In);
				t.start();
			}
		}
	},
	stopJump: function () {
		this.continueJump = false;
	},
	moveToStart: function (x, y) {
		this.sprite.body.x = x;
		this.sprite.body.y = y;
		
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
	},
	checkJump: function () {
		// allow another jump if the jump key is no longer down
		this.canJump = true;
		this.canMove = true;
		
		// emit a little particle effect
		emitter = game.add.emitter(this.sprite.body.x, this.sprite.body.y + (this.sprite.height / 2) - 10, 200);
		
		emitter.makeParticles('block');

		emitter.setXSpeed(-100, 100);
		emitter.setYSpeed(-3, 0);

		emitter.bringToTop = true;
		emitter.setRotation(0, 0);
		emitter.setAlpha(1, 1, 500);
		emitter.setScale(0.2, 0.3, 0.2, 0.3, 500);
		emitter.gravity = -50;

		emitter.start(true, 300, null, 2);
	}
}