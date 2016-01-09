var PointerController = function (parent) {
	this.editor = parent;
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
				this.editor.map.removeBlocksWithin(hitbox);
			}
			this.originPointer = null;
		}
	},
	
	update: function () {
		// place blocks if mouse is down
		if(game.input.activePointer.leftButton.isDown && !this.editor.bubbleController.showing && this.editor.bubbleController.hidden && this.editor.map.UIUp) {
			this.editor.map.place();
		}
		
		// click on canvas to close bubbles when open
	},
	
	drawNet: function (pointer) {
		this.graphics.lineStyle(1, 0x334D63, 1);
		this.graphics.beginFill(0x398DB2);
		this.graphics.drawRect(game.camera.x + this.originPointer.x, game.camera.y + this.originPointer.y, pointer.x - this.originPointer.x, pointer.y - this.originPointer.y);
	}
};