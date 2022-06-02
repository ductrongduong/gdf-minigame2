var LightGiant = Monster.extend({
    ctor:function() {
        this._super();
        this.timeToRun = 1;
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "light_giant.png"));
    }
})