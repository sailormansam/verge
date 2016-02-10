var ToolTip = function () {
    this.create();
};

ToolTip.prototype = {
    create: function () {
        
    },
    
    add: function (hoverTarget, tip) {
        var text = game.add.text(hoverTarget.x, hoverTarget.y + 40, tip, textStyle.small);
        text.anchor.set(0.5);
        text.visible = false;
        
        hoverTarget.events.onInputOver.add((function(){
            text.visible = true;
        }), this);
        
        hoverTarget.events.onInputOut.add((function(){
            text.visible = false;
        }), this);
    }
};