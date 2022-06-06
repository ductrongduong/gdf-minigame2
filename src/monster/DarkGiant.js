var DarkGiant = Monster.extend({
    ctor:function() {
        this._super();
        this.timeToRun = .75;
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "monster_dark_giant_run_0020.png"));
        this.startRightFrame = 28;
        this.endRightFrame = 41;
        this.startUpFrame = 56;
        this.endUpFrame = 69;
        this.startDownFrame = 0;
        this.endDownFrame = 13;

    },

    animationTurn : function (startFrame, endFrame, direction) {
        var darkGiantFrame = [];

        for (var i = startFrame; i <= endFrame; i++) {
            if (i >= 10) {
                var fileName = "monster_dark_giant_run_00" + i + ".png";
            }
            else {
                var fileName = "monster_dark_giant_run_000" + i + ".png";
            }
            var frame = cc.spriteFrameCache.getSpriteFrame(fileName);
            // if (direction == "left") frame.setSkewX(-1);
            darkGiantFrame.push(frame)
        }

        var animation = new cc.Animation(darkGiantFrame, (endFrame - startFrame + 1) / this.timeToRun);
        var act = cc.animate(animation).repeatForever();
        this.runAction(act);

    }
})