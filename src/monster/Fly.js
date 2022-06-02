var Fly = Monster.extend({
    ctor:function() {
        this._super();
        this.timeToRun = 0.5;
        this.loc = getLocationMonsterInMatrix(this.getPosition());
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "fly.png"));
    },
    findPathToTarget : function () {
        var vitri = getLocationMonsterInMatrix(this.getPosition());
        this.pathToTarget = bFSPath(vitri, {row : fieldSize - 1, col : fieldSize - 1}, findNeighborFly);
    }
})