GameStates.Editor = function (game) {
	// properties
	this.player;
	this.map;
	this.teleporter;
	this.mapButton;
	this.bubbleController;
	this.previousLocation = new Phaser.Point(0, 0);
	this.actions;
	this.currentAction;
		
	// keys
	this.bubbleKey;
	
	// collison layers
	this.playerCollisionGroup;
	this.blockCollisionGroup;
	
	// constants
	this.GRAVITY = 1000;
};

GameStates.Editor.prototype = {
	create: function () {
		// reset variables
		this.player = null;
		this.bubbleShow = false;
		this.currentAction = null;
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 1;
		game.physics.p2.gravity.y = this.GRAVITY;
		game.physics.p2.damping = 1;
		
		// turn on collision callbacks with collision groups
		game.physics.p2.setImpactEvents(true);
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
		this.blockCollisionGroup = game.physics.p2.createCollisionGroup();
		
		// set world bounds
		game.world.setBounds(0, 0, 2000, 2000);
		
		// make level
		this.map = new Canvas(this);
		
		// draw grid for reference
		this.drawGrid();
		
		// create map button
		this.mapButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.mapButton.onDown.add(this.saveMap, this);
		
		// move map with middle mouse
		game.input.addMoveCallback(function(pointer, x, y) {
			if(pointer.middleButton.isDown) {
				game.camera.x -= x - this.previousLocation.x;
				game.camera.y -= y - this.previousLocation.y;
			}
			
			this.previousLocation = new Phaser.Point(x, y);
		}, this);
		
		// populate actions
		this.actions = [
			new BlockDynamicObject(),
			new BlockStaticObject(),
			new StartObject(),
			new TeleporterObject()
		];
		
		// populate the bubbles with actions
		this.bubbleController = new BubbleController();
		this.bubbleController.add(new Bubble(this, this.actions[0], 50));
		this.bubbleController.add(new Bubble(this, this.actions[1], 50));
		this.bubbleController.add(new Bubble(this, this.actions[2], 50));
		this.bubbleController.add(new Bubble(this, this.actions[3], 50));
		
		// set up keys
		this.bubbleKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.bubbleKey.onDown.add(this.toggle, this);
		
		//  Stop the following keys from propagating up to the browser
		game.input.keyboard.addKeyCapture([ Phaser.Keyboard.Q ]);
	},
	
	preRender: function () {
	},
	
	update: function () {
		this.move();
	},
	
	toggle: function () {
		if(this.bubbleController.showing) {
			this.bubbleController.hide(new Phaser.Point(game.input.x, game.input.y));
		}
		else {
			this.bubbleController.show(new Phaser.Point(game.input.x, game.input.y));
		}
	},
	
	saveMap: function () {
		// spit out a json object
		var blocks = [];
		for( var i = 0, len = this.block.length; i < len; i++) {
			blocks.push({type: 'STATIC', x:this.block[i].x, y:this.block[i].y});
		}
		
		console.log(JSON.stringify({"block":blocks}));
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
		for(var i = 0, len = game.world.width / this.map.MAP_GRAIN; i < len; i++) {
			// draw line
			bmd.ctx.moveTo(i * this.map.MAP_GRAIN, 0);
			bmd.ctx.lineTo(i * this.map.MAP_GRAIN, game.world.height);
		}
		
		// loop through grid y
		for(var i = 0, len = game.world.height / this.map.MAP_GRAIN; i < len; i++) {
			// draw line
			bmd.ctx.moveTo(0, i * this.map.MAP_GRAIN);
			bmd.ctx.lineTo(game.world.width, i * this.map.MAP_GRAIN);
		}
		
		bmd.ctx.stroke();
		bmd.ctx.closePath();
		
		// add grid to stage
		game.add.sprite(0, 0, bmd);
	}
};
