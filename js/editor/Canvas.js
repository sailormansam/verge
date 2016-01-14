var Canvas = function (parent) {
	this.editor = parent;
	this.data;
	this.blocks;
	
	this.materialKey = {
		STATIC: this.editor.actions[0].sprite.key,
		DYNAMIC: this.editor.actions[1].sprite.key,
		START: this.editor.actions[2].sprite.key,
		TELEPORTER: this.editor.actions[3].sprite.key
	};
	
	this.clickElement = game.add.sprite(0, 0);
	this.clickElement.width = game.world.width;
	this.clickElement.height = game.world.height;
	
	// layers
	this.UILayer;
	
	this.loadButton;
	this.saveButton;
	this.UIUp;
	this.levels;
	
	// constants
	this.MAP_GRAIN = 40;	// size of map blocks
	
	this.create();
};

Canvas.prototype = {
	create: function () {
		// reset variables
		this.blocks = [];
		this.UIUp = true;
		
		// get json
		this.data = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
		
		this.UILayer = game.add.group();
		this.UILayer.fixedToCamera = true;
		
		this.loadLayer = game.add.group();
		this.loadLayer.fixedToCamera = true;
		
		this.saveButton = game.add.sprite(game.width - 140, 80, 'save');
		this.saveButton.inputEnabled = true;
		this.saveButton.events.onInputDown.add(this.save, this);
		this.saveButton.events.onInputUp.add(this.upUI, this);
		this.saveButton.input.priorityID = 2;
		this.saveButton.anchor.set(0.5);
		this.saveButton.input.useHandCursor = true;
		this.UILayer.add(this.saveButton);
		
		this.loadButton = game.add.sprite(game.width - 80, 80, 'load');
		this.loadButton.inputEnabled = true;
		this.loadButton.events.onInputDown.add(this.load, this);
		this.loadButton.input.priorityID = 2;
		this.loadButton.anchor.set(0.5);
		this.loadButton.input.useHandCursor = true;
		this.UILayer.add(this.loadButton);
		
		this.clickElement.inputEnabled = true;
		this.clickElement.events.onInputDown.add(this.click, this);
		this.clickElement.events.onInputUp.add(this.up, this);
		this.clickElement.input.priorityID = 1;
		
		// get json
		this.data = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
		
		// make bubbles or UI to show and click levels
		this.level = 0;
		
		// create load ui
		// create overlay background
		var graphics = game.add.graphics(0, 0);
		graphics.beginFill(0xffffff);
		graphics.drawRect(0, 0, game.width, game.height);

		var background = game.add.sprite(0, 0, graphics.generateTexture());
		background.alpha = 0.65;
		background.inputEnabled = true;
		background.input.priorityID = 3;
		background.events.onInputDown.add(function(){
			this.hideLoad();
		}, this);
		
		graphics.destroy();
		
		this.loadLayer.add(background);
		
		for(var i = 0, len = this.data.level.length; i < len; i++) {
			this.createLoadBubble(i);
		}
		
		this.loadLayer.alpha = 0;
		this.loadLayer.visible = false;
		this.loadLayer.cameraOffset.y = 25;
		
		// load level text
		var loadText = game.add.text(game.width * .5, 100, 'LOAD LEVEL', textStyle['large']);
		loadText.anchor.set(0.5);
		this.loadLayer.add(loadText);
	},
	
	load: function () {
		console.log('load');
		
		// bring up levels to pick from
		this.loadLayer.alpha = 0;
		this.loadLayer.visible = true;
		game.add.tween(this.loadLayer.cameraOffset).to({ y: 0 }, 500, Phaser.Easing.Quadratic.InOut, true);
		game.add.tween(this.loadLayer).to({ alpha: 1 }, 500, Phaser.Easing.Quadratic.InOut, true);
		
		this.UIUp = false;
		this.editor.overlayActive = true;
	},
	
	createLoadBubble: function (i) {
		var bubbleGroup = game.add.group();
		bubbleGroup.x = i * 60 + 200;
		bubbleGroup.y = 150;
		
		// create bubble
		var bubble = game.add.sprite(0, 0, 'bubble');
		bubble.inputEnabled = true;
		bubble.events.onInputDown.add(function(){ this.loadLevel(i) }, this);
		bubble.events.onInputUp.add(this.upUI, this);
		bubble.input.priorityID = 4;
		bubble.input.useHandCursor = true;
		bubbleGroup.add(bubble);
		
		// level number
		var levelText = game.add.text(bubble.width / 2, bubble.height / 2 + 3, i, textStyle['normal']);
		levelText.anchor.set(0.5);
		bubbleGroup.add(levelText)
		
		this.loadLayer.add(bubbleGroup);
	},
	
	loadLevel: function (level) {
		// empty block array show warning or have undo button
		this.blocks.forEach(function (block) {
			block.destroy();
		});
		this.blocks = [];
		
		// create map
		for(var i = 0, len = this.data.level[level].blocks.length; i < len; i++) {
			var newBlock = new Block(this.data.level[level].blocks[i].x * this.MAP_GRAIN,
									   this.data.level[level].blocks[i].y * this.MAP_GRAIN,
									   this.materialKey[this.data.level[level].blocks[i].material],
									   this.data.level[level].blocks[i].material);
			this.blocks.push(newBlock);
			this.editor.blockLayer.add(newBlock);
		}
		
		this.hideLoad();
	},
	
	hideLoad: function() {
		// hide load layer
		this.loadLayer.alpha = 1;
		
		game.add.tween(this.loadLayer.cameraOffset).to({ y: 25 }, 500, Phaser.Easing.Quadratic.InOut, true);
		var tween = game.add.tween(this.loadLayer).to({ alpha: 0 }, 500, Phaser.Easing.Quadratic.InOut, true);
		tween.onComplete.add(function(){
			this.loadLayer.visible = false;
			this.editor.overlayActive = false;
		}, this);
	},
	
	save: function () {
		var mapSave = {
			levels:[
				{
					start: {x: 0, y: 0},
					teleporter: {x: 0, y: 0},
					blocks: []
				}
			]
		};
		
		// generate blocks and print out
		this.blocks.forEach(function(block){
			if(block.material == "START") {
				mapSave.levels[0].start = {x: block.x, y: block.y};
			}
			else if(block.material == "TELEPORTER") {
				mapSave.levels[0].teleporter = {x: block.x, y: block.y};
			}
			else {
				mapSave.levels[0].blocks.push({ material: block.material, x: block.x, y: block.y });
			}
		});
		
		console.log(JSON.stringify(mapSave));
		this.UIUp = false;
	},
	
	upUI: function () {
		this.UIUp = true;
	},
	
	click: function () {
		if(!this.editor.bubbleController.hidden) {
			this.editor.bubbleController.hide();
		}
	},
	
	up: function () {
		// set hidden equal to true because it will always hide bubbles when clicking on canvas
		if(!this.editor.bubbleController.hidden) {
			this.editor.bubbleController.hidden = true;
		}
	},
	
	place: function () {
		// place block if there is an action and if it checks out with that actions verification
		if(this.editor.bubbleController.currentAction && this.editor.bubbleController.currentAction.check(this.blocks)) {
			var pointer = game.input;

			// get a pointer relative to camera
			var truePointer = {
				x: Math.floor(((pointer.x + game.camera.x) / this.MAP_GRAIN)),
				y: Math.floor(((pointer.y + game.camera.y) / this.MAP_GRAIN))
			};

			console.log(truePointer);
			// check if there is a block at pointer location
			for(var i = 0, len = this.blocks.length; i < len; i++) {
				if(this.blocks[i].x == truePointer.x * this.MAP_GRAIN
				   && this.blocks[i].y == truePointer.y * this.MAP_GRAIN) {
					return;
				}
			}
			
			var newBlock = new Block(truePointer.x * this.MAP_GRAIN, truePointer.y * this.MAP_GRAIN, this.editor.bubbleController.currentAction.sprite.key, this.editor.bubbleController.currentAction.material);
			this.blocks.push(newBlock);
			this.editor.blockLayer.add(newBlock);
		}
	},
	
	addBlocksWithin: function (hitbox) {
		// remove elements that overlap hitbox
//		
//		// find a rectangle that matches grid then fill rectangle
//		var truePointer = new Phaser.Point(Math.floor(hitbox.x / this.MAP_GRAIN), Math.floor(hitbox.y / this.MAP_GRAIN));
//		var trueDim = new Phaser.Point(Math.ceil((hitbox.x + hitbox.width) / this.MAP_GRAIN) + truePointer.x, Math.ceil((hitbox.y + hitbox.height) / this.MAP_GRAIN) + truePointer.y);
//		
//		for(var i = truePointer.x; i < trueDim.x; i++) {
//			for(var j = truePointer.y; j < trueDim.y; j++) {
//				for(var k = 0, len = this.blocks.length; k < len; k++) {
//					if(this.blocks[k].x != i * this.MAP_GRAIN
//					   || this.blocks[k].y != j * this.MAP_GRAIN) {
//						var newBlock = new Block(i * this.MAP_GRAIN, j * this.MAP_GRAIN, this.editor.bubbleController.currentAction.sprite.key, this.editor.bubbleController.currentAction.material);
//						this.blocks.push(newBlock);
//						this.editor.blockLayer.add(newBlock);
//					}
//				}
//			}
//		}
	},
	
	removeBlocksWithin: function (hitbox) {
		// remove elements that overlap hitbox
		var i = this.blocks.length
		while (i--) {
			if(Phaser.Rectangle.intersects(this.blocks[i].getBounds(), hitbox)) {
				this.blocks[i].destroy();
				this.blocks.splice(i, 1);
			}
		}
	}
};