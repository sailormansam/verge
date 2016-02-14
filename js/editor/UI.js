var UI = function (parent) {
	// properties
	this.editor = parent;
	this.actions;
	this.bubbleController;
	this.overlayActive;
	this.loadButton;
	this.saveButton;
	this.UIUp;
	
	// overlays
	this.loadOverlay;
    this.rotationOverlay;
	
	// layers
	this.UILayer;
	this.overlayLayer;
	
	// keys
	this.bubbleKey;
	
	this.create();
};

UI.prototype = {
	create: function () {
		// set properties
		this.overlayLayer = false;
		this.UIUp = true;
		
		// create layers
		this.UILayer = game.add.group();
		this.UILayer.fixedToCamera = true;
		
		this.overlayLayer = game.add.group();
		this.overlayLayer.fixedToCamera = true;
		this.overlayLayer.cameraOffset.y = 25;
		
		// populate the bubbles with actions
		this.bubbleController = new BubbleController(this.editor.toolTipManager);
		this.bubbleController.add(new Bubble(this, this.editor.actions[0], 45));
		this.bubbleController.add(new Bubble(this, this.editor.actions[1], 45));
		this.bubbleController.add(new Bubble(this, this.editor.actions[2], 45));
		this.bubbleController.add(new Bubble(this, this.editor.actions[3], 45));
		
		// set first bubble as active
		this.bubbleController.setActive(this.bubbleController.bubbles[0]);
        
        // add tool tips
        this.editor.toolTipManager.add(this.bubbleController.bubbles[0].background, 'Static', this.bubbleController.bubbles[0]);
        this.editor.toolTipManager.add(this.bubbleController.bubbles[1].background, 'Dynamic', this.bubbleController.bubbles[1]);
        this.editor.toolTipManager.add(this.bubbleController.bubbles[2].background, 'Start', this.bubbleController.bubbles[2]);
        this.editor.toolTipManager.add(this.bubbleController.bubbles[3].background, 'End', this.bubbleController.bubbles[3]);
		
		// add to bubbles to UI layer
		this.UILayer.add(this.bubbleController.bubbleLayer);
		
		// save and load buttons
		this.loadButton = game.add.sprite(game.width - 80, 80, 'load');
		this.loadButton.inputEnabled = true;
		this.loadButton.events.onInputDown.add(this.load, this);
		this.loadButton.input.priorityID = 2;
		this.loadButton.anchor.set(0.5);
		this.loadButton.input.useHandCursor = true;
		this.UILayer.add(this.loadButton);
        this.editor.toolTipManager.add(this.loadButton, 'Load');
        
		this.saveButton = game.add.sprite(game.width - 140, 80, 'save');
		this.saveButton.inputEnabled = true;
		this.saveButton.events.onInputDown.add(this.save, this);
		this.saveButton.events.onInputUp.add(this.upUI, this);
		this.saveButton.input.priorityID = 2;
		this.saveButton.anchor.set(0.5);
		this.saveButton.input.useHandCursor = true;
		this.UILayer.add(this.saveButton);
        this.editor.toolTipManager.add(this.saveButton, 'Save');
        
        this.rotationButton = game.add.sprite(game.width - 200, 80, 'rotation');
		this.rotationButton.inputEnabled = true;
		this.rotationButton.events.onInputDown.add(this.rotate, this);
		this.rotationButton.events.onInputUp.add(this.upUI, this);
		this.rotationButton.input.priorityID = 2;
		this.rotationButton.anchor.set(0.5);
		this.rotationButton.input.useHandCursor = true;
		this.UILayer.add(this.rotationButton);
        this.editor.toolTipManager.add(this.rotationButton, 'Rotate');
		
		// overlays
		// create load overlay
		this.loadOverlay = new LoadOverlay(this);
        this.rotationOverlay = new RotationOverlay(this);
		
		//inputs
		// set up keys to active block bubbles
		this.bubbleKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.bubbleKey.onDown.add(this.toggleBubbles, this);
		
		// Stop the following keys from propagating up to the browser
		game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
	},
    
    rotate: function () {
        // set rotation amount for level
        this.rotationOverlay.show();
        this.UIUp = false;
        
        // clear tool tip timer or else tips will get stuck
        this.editor.toolTipManager.clearTimer();
    },
	
	save: function () {
		var mapSave = {
            start: {x: 0, y: 0},
            teleporter: {x: 0, y: 0},
            rotation: { theta: 0 },
            blocks: []
		};
        
        // set rotation
        if(this.editor.canvas.rot) {
            mapSave.rotation.theta = this.editor.canvas.rot;
        }
		
		// generate blocks and print out
		this.editor.canvas.blocks.forEach(function(block){
			if(block.material == "START") {
				mapSave.start = {x: block.x / this.editor.canvas.MAP_GRAIN, y: block.y / this.editor.canvas.MAP_GRAIN};
			}
			else if(block.material == "TELEPORTER") {
				mapSave.teleporter = {x: block.x / this.editor.canvas.MAP_GRAIN, y: block.y / this.editor.canvas.MAP_GRAIN};
			}
			else {
				mapSave.blocks.push({ material: block.material, x: block.x / this.editor.canvas.MAP_GRAIN, y: block.y / this.editor.canvas.MAP_GRAIN });
			}
		}, this);
		
        // save to local storage
        var storage = localStorage;
        
        var newLevels = this.editor.data.levels;
        newLevels[this.editor.canvas.level] = mapSave;
        
        newLevels = { 'levels': newLevels };
        
        localStorage.setItem('levels', JSON.stringify(newLevels));
        
        this.editor.data = newLevels;
        
		this.UIUp = false;
        
        // clear tool tip timer or else tips will get stuck
        this.editor.toolTipManager.clearTimer();
	},
	
	load: function () {
		//show overlay
		this.loadOverlay.show();
        
        // clear tool tip timer or else tips will get stuck
        this.editor.toolTipManager.clearTimer();
	},
	
	hideLoad: function() {
		// hide overlay
		this.loadOverlay.hide();
	},
	
	upUI: function () {
		this.UIUp = true;
	},
	
	toggleBubbles: function () {
		if(!this.overlayActive) {
			if(!this.bubbleController.showing) {
				this.bubbleController.show();
				this.bubbleController.hidden = false;
			}
			else {
				this.bubbleController.hide();
				this.bubbleController.hidden = true;
			}
            
            console.log('toggle');
            // clear tool tip timer or else tips will get stuck
            this.editor.toolTipManager.clearTimer();
		}
	}
};