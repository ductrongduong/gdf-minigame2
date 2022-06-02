var Rock = Obstacle.extend({
    ctor:function() {
        this._super();
        this.val = "rock";
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "rock.png"));
    }
})