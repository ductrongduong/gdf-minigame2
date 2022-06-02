var Monster = cc.Sprite.extend({
    timeToRun : null, // thời gian di chuyển giữa 2 ô
    pathToTarget : null, // đường đi tới đích
    location : null,

    ctor:function() {
        this._super();
        this.location = {row : 0, col : 0};
        // monster.runAction(move({row : 6, col : 6}));

    },
    onEnter:function() {
        this._super();
        this.setPosition(getBoxLocation(0, 0))
        this.action();
    },

    action:function (){
        console.log("hello");
        this.stopAllActions();
        this.findPathToTarget();
        var arr = [];

        for (var i = 1; i < this.pathToTarget.length; i++) {
            arr.push(cc.delayTime(0));
            arr.push(cc.moveTo(this.timeToRun, getBoxLocation(this.pathToTarget[i].row, this.pathToTarget[i].col)));

        }
        arr.push(cc.callFunc(()=>this.removeFromParent()));
        this.runAction(cc.sequence(arr));
    },
    findPathToTarget : function () {
        // console.log("hello")
        var vitri = getLocationMonsterInMatrix(this.getPosition());
        this.pathToTarget = bFSPath(vitri, {row : fieldSize - 1, col : fieldSize - 1}, findNeighborMonsterCantFly);
    }
});