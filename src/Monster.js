var Monster = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.timeToRun = 0.5;
        this.row = 0;
        this.col = 0;
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "monster.png"));
        tileArray[0][0].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "land.png"));
        this.pathToTarget = findPath({row : 0, col : 0}, {row : fieldSize - 1, col : fieldSize - 1});
        // monster.runAction(move({row : 6, col : 6}));

    },
    onEnter:function() {
        this._super();
        this.setPosition(getBoxLocation(0, 0))
        // var moveAction= cc.MoveTo.create(20, cc.p(1000, 1000));
        // this.runAction(moveAction);
        var currentIndexOfPath = 0;

        var arr = [];
        this.action();
        // for (var i = 0; i < this.pathToTarget.length; i++) {
        //     arr.push(cc.delayTime(0));
        //     // var time = (i + 1) * 0.1;
        //     arr.push(cc.moveTo(0.5, getBoxLocation(this.pathToTarget[i].row, this.pathToTarget[i].col)));
        //
        //     // arr.push(cc.callFunc(function (_i){
        //     //     cc.log("test i", _i);
        //     // }.bind(null, i)
        //     // ));
        // }
        // arr.push(cc.callFunc(()=>this.removeFromParent()));
        //
        // // this.runAction(move({row : 6, col : 6}));
        // this.runAction(cc.sequence(arr));
        // console.log("hello")
    },
    action:function (){
        this.stopAllActions();
        var vitri = getMonsterInMatrix(this.getPosition());
        this.pathToTarget = bFSPath(vitri, {row : fieldSize - 1, col : fieldSize - 1});
        var arr = [];

        for (var i = 0; i < this.pathToTarget.length; i++) {
            arr.push(cc.delayTime(0));
            // var time = (i + 1) * 0.1;
            arr.push(cc.moveTo(this.timeToRun, getBoxLocation(this.pathToTarget[i].row, this.pathToTarget[i].col)));

            // arr.push(cc.callFunc(function (_i){
            //     cc.log("test i", _i);
            // }.bind(null, i)
            // ));
        }
        arr.push(cc.callFunc(()=>this.removeFromParent()));

        // this.runAction(move({row : 6, col : 6}));
        this.runAction(cc.sequence(arr));
        // console.log("hello")
    }
});