GameStates.Editor = function (game) {
	// properties
	this.player;
	this.map;
	this.teleporter;
	this.mapButton;
	this.bubbleController;
	this.actions;
	this.pointerController;
	this.overlayActive;
	
	// keys
	this.bubbleKey;
	
	// layers
	this.blockLayer;
	this.UILayer;
	
	// constants
	this.MAP_GRAIN = 40;	// size of map blocks
};

GameStates.Editor.prototype = {
	create: function () {
		// reset variables
		this.bubbleShow = false;
		this.screenActive = false;
		
		// set world bounds
		game.world.setBounds(0, 0, 2000, 2000);
		
		// draw grid for reference
		this.drawGrid();
		
		this.blockLayer = game.add.group();
		this.UILayer = game.add.group();
		this.UILayer.fixedToCamera = true;
		
		// populate actions
		this.actions = [
			new BlockDynamicObject(),
			new BlockStaticObject(),
			new StartObject(),
			new TeleporterObject()
		];
		
		// populate the bubbles with actions
		this.bubbleController = new BubbleController();
		this.bubbleController.add(new Bubble(this, this.actions[0], 45));
		this.bubbleController.add(new Bubble(this, this.actions[1], 45));
		this.bubbleController.add(new Bubble(this, this.actions[2], 45));
		this.bubbleController.add(new Bubble(this, this.actions[3], 45));
		
		// set first bubble as active
		this.bubbleController.setActive(this.bubbleController.bubbles[0]);
		
		// add to bubbles to UI layer
		this.UILayer.add(this.bubbleController.bubbleLayer);
		
		// set up keys to active block bubbles
		this.bubbleKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.bubbleKey.onDown.add(this.toggle, this);
		
		// Stop the following keys from propagating up to the browser
		game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
		
		// make level
		this.map = new Canvas(this);
		
		// pointer Controller
		this.pointerController = new PointerController(this);
	},
	
	preRender: function () {
		if(!this.overlayActive) {
			this.pointerController.preRender();
		}
	},
	
	update: function () {
		if(!this.overlayActive) {
			this.move();
			this.pointerController.update();
		}
	},
	
	toggle: function () {
		if(!this.overlayActive) {
			if(!this.bubbleController.showing) {
				this.bubbleController.show();
				this.bubbleController.hidden = false;
			}
			else {
				this.bubbleController.hide();
				this.bubbleController.hidden = true;
			}
		}
	},
	
	move: function () {
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)
		   || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			game.camera.x -= 5;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D)
			   || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			game.camera.x += 5;
		}
		
		// move up and down
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)
		   || game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			game.camera.y -= 5;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S)
			   || game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			game.camera.y += 5;
		}
	},
	
	drawGrid: function () {
		var bmd = game.add.bitmapData(game.world.width, game.world.height);

		bmd.ctx.beginPath();
		bmd.ctx.lineWidth = "1";
		bmd.ctx.strokeStyle = 'e1e1e1';
		bmd.ctx.setLineDash([1,2]);
		
		// loop through grid x
		for(var i = 0, len = game.world.width / this.MAP_GRAIN; i < len; i++) {
			// draw line
			bmd.ctx.moveTo(i * this.MAP_GRAIN, 0);
			bmd.ctx.lineTo(i * this.MAP_GRAIN, game.world.height);
		}
		
		// loop through grid y
		for(var i = 0, len = game.world.height / this.MAP_GRAIN; i < len; i++) {
			// draw line
			bmd.ctx.moveTo(0, i * this.MAP_GRAIN);
			bmd.ctx.lineTo(game.world.width, i * this.MAP_GRAIN);
		}
		
		bmd.ctx.stroke();
		bmd.ctx.closePath();
		
		// add grid to stage
		game.add.sprite(0, 0, bmd);
	}
};
