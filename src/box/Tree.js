var Tree = Obstacle.extend({
    ctor:function() {
        this._super();
        this.val = "tree";
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "tree.png"));
    }
})