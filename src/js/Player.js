var Player = function (game) {
	this.game = game;
	this.sprite;
	this.width = 25;
	this.height = 40;
	
	this.SPEED = 300;
	this.GRAVITY = 1000;
	this.JUMP = -450;
	
	this.create();
}

Player.prototype = {
	create: function () {
		// create player
		var graphics = game.add.graphics(0, 0);
		
		graphics.beginFill(0x333333);
		graphics.drawRect(0, 0, this.width, this.height);
		
		this.sprite = game.add.sprite(200, 200, graphics.generateTexture());
		graphics.destroy();
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 1;
		game.physics.p2.enable(this.sprite);
		game.physics.p2.gravity.y = this.GRAVITY;
		game.physics.p2.damping = 1;
		
		// player physics settings
		this.sprite.body.mass = 1;
	},
	update: function () {
		this.move();
	},
	move: function () {
		this.sprite.body.rotation = 0;
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)
		  || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			this.sprite.body.velocity.x = -this.SPEED;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D)
			   || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			this.sprite.body.velocity.x = this.SPEED;
		}
		else {
			
		}
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)
		  || game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			this.sprite.body.velocity.y = this.JUMP;
		}
	}
}