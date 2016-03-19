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
                
                var originPoint = new Phaser.Point(game.input.x, game.input.y);
                
				this.originPointer = {
					x: originPoint.x,
					y: originPoint.y
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
        var locAdj = this.relativeToAngle(new Phaser.Point(this.originPointer.x - this.gameState.spriter.x, this.originPointer.y - this.gameState.spriter.y));
        var adjusted = this.relativeToAngle(new Phaser.Point(pointer.x - this.originPointer.x, pointer.y - this.originPointer.y));
		this.graphics.drawRect(locAdj.x, locAdj.y, adjusted.x, adjusted.y);
	},
    
    relativeToAngle: function (pointer) {
        // get distance of pointer to 0,0
        var angle = Math.atan2(pointer.y, pointer.x);
        
        angle += -(Math.PI / 180) * parseInt(this.gameState.map.rotation);
        
        var distance = pointer.distance(new Phaser.Point(0,0));
        
        var x = Math.cos(angle) * distance;
        var y = Math.sin(angle) * distance;
        
        return new Phaser.Point(x, y);
    }
};