// if limit = 0 there will be no limit
var ActionObject = function (sprite, material, limit) {
	this.sprite = game.make.sprite(0, 0, sprite);
	this.material = material;
	this.limit = limit;
};

ActionObject.prototype.check = function(blocks) {
	// count for this type
	if(this.limit != 0) {
		var count = 0;
		
		for(var i = 0, len = blocks.length; i < len; i++) {
			if(this.material == blocks[i].material) {
				count++;
			}
		}
		
		if(count >= this.limit) {
			return false;
		}
	}
	
	return true;
}