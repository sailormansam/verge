var History = function (parent) {
	// properties
	this.editor = parent;
	this.stack;
	this.actionCache;
	
	// keys
	this.undoKey;
	
	this.create();
};

History.prototype = {
	create: function () {
		// set properties
		this.stack = [];
		this.actionCache = [];
		
		// ctrl z functionality
		this.undoKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
		this.undoKey.onDown.add(this.undo, this);
	},
	
	pushCache: function () {
		// push action onto history stack
		if(this.actionCache.length > 0) {
			this.stack.push(this.actionCache);

			// clear action temp cache
			this.actionCache = [];
		}
	},
	
	undo: function () {
		if(this.undoKey.ctrlKey && this.stack.length > 0) {
			// pop last action on stack and undo
			var undoElement = this.stack.pop();
			
			// remove or add based on type
			var i = undoElement.length;
			while(i--) {
				switch(undoElement[i].type) {
					case "add":
						this.editor.canvas.blocks[undoElement[i].index].destroy();
						this.editor.canvas.blocks.splice(undoElement[i].index, 1);
						break;
					case "remove":
						var newBlock = new Block(undoElement[i].value.x, undoElement[i].value.y, undoElement[i].value.key, undoElement[i].value.material);
						this.editor.canvas.blocks.push(newBlock);
						blockLayer.add(newBlock);//this.editor.canvas.blockLayer.add(newBlock);
						break;
				}
			}
		}
	}
};