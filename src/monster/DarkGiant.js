var DarkGiant = Monster.extend({
    ctor:function() {
        this._super();
        this.timeToRun = 1;
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "dark_giant.png"));
    }
})