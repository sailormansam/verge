GameStates.MainMenu = function (game) {
	this.background;
};

GameStates.MainMenu.prototype = {
	create: function () {
        var loadingText = game.add.text(game.world.centerX, game.width * 2, 'VERGE', { font: "6em squada one", fill: "#333"});
        var playText = game.add.text(game.height * 7, game.width * 2, 'PLAY', { font: "3em squada one", fill: "#333"});
        playText.inputEnabled = true;
        playText.events.onInputDown(this.play, this);
	},
    play: function() {
        game.state.start('game');
    }
    
};