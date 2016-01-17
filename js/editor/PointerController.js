var PointerController = function (parent) {
	this.editor = parent;
	this.graphics;
	this.originPointer;
	this.previousLocation = new Phaser.Point(0, 0);
	this.shiftKey;
	this.netColor;
	this.netBorderColor;
	this.addBlocks = false;
	
	this.create();
};

PointerController.prototype = {
	create: function () {
		// place a block on click
		game.input.mouse.capture = true;
		
		// add graphics layer make semi transparent
		this.graphics = game.add.graphics(0, 0);
		this.graphics.alpha = 0.5;
		
		this.shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	},
	
	preRender: function () {
		// clear graphics before potential drawing
		this.graphics.clear();
		
		// make nets more obvious what they do
		if(game.input.activePointer.rightButton.isDown || (game.input.activePointer.leftButton.isDown && this.shiftKey.isDown)) {
			if(game.input.activePointer.rightButton.isDown) {
				this.netColor = 0xD13030;
				this.netBorderColor = 0x7A2020;
				this.addBlocks = false;
			} else if (game.input.activePointer.leftButton.isDown && this.shiftKey.isDown) {
				this.netColor = 0x3CB58A;
				this.netBorderColor = 0x295141;
				this.addBlocks = true;
			}
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
				
				// remove or add blocks under net
				if(this.addBlocks) {
					this.editor.canvas.addBlocksWithin(hitbox);
					this.editor.history.pushCache();
				}
				else {
					this.editor.canvas.removeBlocksWithin(hitbox);
					this.editor.history.pushCache();
				}
			}
			this.originPointer = null;
		}
	},
	
	update: function () {
		// place blocks with left click
		if(game.input.activePointer.leftButton.isDown && !this.editor.UI.bubbleController.showing && this.editor.UI.bubbleController.hidden && this.editor.UI.UIUp && this.shiftKey.isUp) {
			this.editor.canvas.place();
		}
		else {
			this.editor.history.pushCache();
		}
		
		// move map with middle mouse
		if(game.input.activePointer.middleButton.isDown) {
			game.camera.x -= game.input.x - this.previousLocation.x;
			game.camera.y -= game.input.y - this.previousLocation.y;
		}
		
		this.previousLocation = new Phaser.Point(game.input.x, game.input.y);
	},
	
	drawNet: function (pointer) {
		this.graphics.lineStyle(1, this.netBorderColor, 1);
		this.graphics.beginFill(this.netColor);
		this.graphics.drawRect(game.camera.x + this.originPointer.x, game.camera.y + this.originPointer.y, pointer.x - this.originPointer.x, pointer.y - this.originPointer.y);
	}
};