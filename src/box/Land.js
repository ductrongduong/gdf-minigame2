var Land = Box.extend({
    ctor:function() {
        this._super();
        this.val = "land";
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "land.png"));
    }
})