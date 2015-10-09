var PointerController = function (gameState) {
	this.gameState = gameState;
	this.graphics;
	this.originPointer;
	
	this.create();
};

PointerController.prototype = {
	create: function () {
		// place a block on click
		game.input.mouse.capture = true;
		
		// add graphics layer make semi transparent
		this.graphics = game.add.graphics(0, 0);
		this.graphics.alpha = 0.5;
	},
	
	preRender: function () {
		// clear graphics before potential drawing
		this.graphics.clear();

		if(game.input.activePointer.rightButton.isDown) {
			// Set the origin of the net
			if(this.originPointer == null) {
				this.originPointer = {
					x: game.input.x,
					y: game.input.y
				};
			}
			this.drawNet(game.input);
		}
		else {
			if(this.originPointer != null) {
				// create hitbox from net this handles dragging the box in any direction
				var a = { x: null, y: null };
				var b = { x: null, y: null };
				
				if( this.originPointer.x < game.input.x ) {
					a.x = this.originPointer.x;
					b.x = game.input.x;
				}
				else {
					a.x = game.input.x;
					b.x = this.originPointer.x;
				}
				
				if( this.originPointer.y < game.input.y ) {
					a.y = this.originPointer.y;
					b.y = game.input.y;
				}
				else {
					a.y = game.input.y;
					b.y = this.originPointer.y;
				}
				
				var hitbox = new Phaser.Rectangle(a.x, a.y, b.x - a.x, b.y - a.y);
				
				// remove blocks under net
				this.gameState.map.removeBlocksWithin(hitbox);
			}
			this.originPointer = null;
		}
	},
	
	update: function () {
		// place blocks if mouse is down
		if(game.input.activePointer.leftButton.isDown) {
			this.gameState.map.placeBlock(game.input);
		}
	},
	
	drawNet: function (pointer) {
		this.graphics.beginFill(0xff0000);
		this.graphics.drawRect(this.gameState.camera.x + this.originPointer.x, this.gameState.camera.y + this.originPointer.y, pointer.x - this.originPointer.x, pointer.y - this.originPointer.y);
	}
};