var ToolTip = function (parent) {
    this.UI = parent;
    this.timer;
    this.tips = [];
};

ToolTip.prototype = {
    add: function (hoverTarget, tip, locationTarget, offset) {
        // set offset to default below
        var anchor = (typeof offset === 'undefined' ? new Phaser.Point(0.5, 0): new Phaser.Point(0, 0.5))
        offset = (typeof offset === 'undefined') ? new Phaser.Point(0, 30): offset;
        
        var text = game.add.text(hoverTarget.x + offset.x, hoverTarget.y + offset.y, tip, textStyle.small);
        this.UI.UILayer.add(text);
        text.anchor.set(anchor.x, anchor.y);
        text.visible = false;
        
        this.tips.push(text);
        
        hoverTarget.events.onInputOver.add((function(){
            
            this.timer = game.time.events.add(Phaser.Timer.SECOND * 0.9, function(){
                if(!locationTarget) {
                    locationTarget = hoverTarget;
                }

                text.x = locationTarget.x + offset.x;
                text.y = locationTarget.y + offset.y;
                text.alpha = 0;
                text.visible = true;
                game.add.tween(text).to({ alpha: 1 }, 250, Phaser.Easing.Quadratic.Out, true);
            }, this);
            
        }), this, 0, hoverTarget, locationTarget);
        
        hoverTarget.events.onInputOut.add((function(){
            game.time.events.remove(this.timer);
            var tween = game.add.tween(text).to({ alpha: 0 }, 250, Phaser.Easing.Quadratic.In, true);
            tween.onComplete.add(function(){
                text.visible = false;
            }, this);
        }), this);
    },
    
    clearTimer: function () {
        if(this.timer) {
            game.time.events.remove(this.timer);
            
            // hide all tips too
            this.tips.forEach(function(tip){
                tip.visible = false;
            });
        }
    }
};