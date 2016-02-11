var ToolTip = function () {
};

ToolTip.prototype = {
    add: function (hoverTarget, tip, locationTarget) {
        var text = game.add.text(hoverTarget.x, hoverTarget.y + 40, tip, textStyle.small);
        text.anchor.set(0.5);
        text.visible = false;
        
        hoverTarget.events.onInputOver.add((function(hoverTarget, locationTarget){
            
            if(!locationTarget) {
                locationTarget = hoverTarget;
            }
            
            text.x = locationTarget.x;
            text.y = locationTarget.y + 40;
            text.visible = true;
        }), this);
        
        hoverTarget.events.onInputOut.add((function(){
            text.visible = false;
        }), this);
    }
};