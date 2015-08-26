var preloader = function(game){};

preloader.prototype = {
	preload: function() {
		
	},
	create: function() {
		game.state.start('mainmenu');
	}
}