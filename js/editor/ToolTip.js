var ToolTip = function () {
    this.timer;
};

ToolTip.prototype = {
    add: function (hoverTarget, tip, locationTarget) {
        var text = game.add.text(hoverTarget.x, hoverTarget.y + 40, tip, textStyle.small);
        text.anchor.set(0.5);
        text.visible = false;
        
        hoverTarget.events.onInputOver.add((function(){
            
            this.timer = game.time.events.add(Phaser.Timer.SECOND * 2, function(){
                if(!locationTarget) {
                    locationTarget = hoverTarget;
                }

                text.x = locationTarget.x;
                text.y = locationTarget.y + 40;
                text.visible = true;
            }, this);
            
        }), this, 0, hoverTarget, locationTarget);
        
        hoverTarget.events.onInputOut.add((function(){
            text.visible = false;
            game.time.events.remove(this.timer);
        }), this);
    }
};