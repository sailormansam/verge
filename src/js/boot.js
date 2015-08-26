var boot = function(game){};

boot.prototype = {
	create: function(){
		game.state.start('preloader');
	}
};