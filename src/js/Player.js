var Player = function (x, y) {
	this.sprite;
	this.x = x;
	this.y = y;
	this.width = 25;
	this.height = 40;
	
	this.SPEED = 300;
	this.JUMP = -450;
	
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
	},
	update: function () {
		this.sprite.body.setZeroRotation();
		this.sprite.body.rotation = 0;
		
		this.move();
	},
	move: function () {
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
		
		// TODO only jump while on ground, or at least hit the ground once
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)
		  || game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			this.sprite.body.velocity.y = this.JUMP;
		}
	},
	moveToStart: function (x, y) {
		this.sprite.body.x = x;
		this.sprite.body.y = y;
		
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
	}
}