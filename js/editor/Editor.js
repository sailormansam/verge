GameStates.Editor = function (game) {
	// properties
	this.canvas;
	this.pointerController;
	this.UI;
	this.history;
	this.actions;
	this.data;
	
	// constants
	this.WORLD_SIZE = 2000;
};

GameStates.Editor.prototype = {
	create: function () {
		// get json
		this.data = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
        
        // load levels into local storage
        var storage = localStorage;
        
        var getLevels = localStorage.getItem('levels');
        
        if (getLevels === null) {
            localStorage.setItem('levels', JSON.stringify(game.cache.getJSON('map')));
        }
        else {
            this.data = { "levels": JSON.parse(getLevels) };
        }
		
		// set world bounds
		game.world.setBounds(0, 0, this.WORLD_SIZE, this.WORLD_SIZE);
		
		// populate actions
		this.actions = [
			new BlockStaticObject(),
			new BlockDynamicObject(),
			new StartObject(),
			new TeleporterObject()
		];
		
		// make level
		this.canvas = new Canvas(this);
		
		// create UI
		this.UI = new UI(this);
		
		// create History manager
		this.history = new History(this);
		
		// pointer Controller
		this.pointerController = new PointerController(this);
		
		// inputs
	},
	
	preRender: function () {
		if(!this.UI.overlayActive) {
			this.pointerController.preRender();
		}
	},
	
	update: function () {
		if(!this.UI.overlayActive) {
			this.move();
			this.pointerController.update();
			this.canvas.update();
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
	}
};
