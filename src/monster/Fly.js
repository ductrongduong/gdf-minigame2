var Fly = Monster.extend({
    ctor:function() {
        this._super();
        this.timeToRun = 0.5;
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "fly.png"));
    }
})