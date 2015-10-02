var Inventory = function (isEditor) {
	this.isEditor = isEditor;
	if(this.isEditor) {
		this.count = 512;
		this.CAP = 512;
	}
	else {
		this.count = 0;
		this.CAP = 5;
	}
	this.sprite = null;
	this.blockWidth = 20;
	this.blockHeight = 20;
	this.x = 0;
	this.y = 0;
	this.paddingX = -20;
	this.paddingY = -45;
	
	this.create();
};

Inventory.prototype = {
	create: function () {
		if(!this.isEditor) {
			this.drawCount();
		}
	},
	preRender: function (player) {
		if(!this.isEditor) {
			this.x = player.sprite.body.x;
			this.y = player.sprite.body.y;

			this.positionSprite();
		}
	},
	change: function (num) {
		this.count += num;
		this.drawCount();
	},
	clear: function () {
		this.count = 0;
		this.drawCount();
	},
	drawCount: function () {
		if(this.sprite) {
			this.sprite.destroy();
		}
		
		var graphics = game.add.graphics(0, 0);
		
		graphics.beginFill(0x999999);
		
		for(var i = 0; i < this.count; i++) {
			graphics.drawRect(i * (this.blockWidth + 5), 0, this.blockWidth, this.blockHeight);
		}
		
		this.sprite = game.add.sprite(this.x + this.paddingX, this.y + this.paddingY, graphics.generateTexture());
		this.positionSprite();
		graphics.destroy();
	},
	positionSprite: function () {
		var spriteWidth = this.sprite.width || 0;
		
		this.sprite.x = this.x + this.paddingX - spriteWidth;
		this.sprite.y = this.y + this.paddingY;
	}
}