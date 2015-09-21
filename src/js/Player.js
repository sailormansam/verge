var Player = function (parent, x, y) {
	this.parent = parent;
	this.sprite;
	this.x = x;
	this.y = y;
	this.width = 25;
	this.height = 40;
	this.canJump = false;
	this.jumpKeyUp = false;
	
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
        console.log(this.canJump, this.jumpKeyUp);
		if((game.input.keyboard.isDown(Phaser.Keyboard.W)
		  || game.input.keyboard.isDown(Phaser.Keyboard.UP))
		  && this.canJump
		  && this.jumpKeyUp) {
			this.sprite.body.velocity.y = this.JUMP;
            game.time.events.add(Phaser.Timer.SECOND, this.stopJump, this).autoDestroy = true;
            console.log('in');
		}
	},
    stopJump: function () {
        this.canJump = false;
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
	}
}