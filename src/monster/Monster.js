var Monster = cc.Sprite.extend({
    timeToRun : null, // thời gian di chuyển giữa 2 ô
    pathToTarget : null, // đường đi tới đích
    location : null,

    ctor:function() {
        this._super();
        this.location = {row : 0, col : 0};
        this.startRightFrame = 28;
        this.endRightFrame = 41;
        this.startUpFrame = 56;
        this.endUpFrame = 69;
        this.startDownFrame = 0;
        this.endDownFrame = 13;
    },
    onEnter:function() {
        this._super();
        this.setPosition(getBoxLocation(0, 0))
        this.action();
    },

    action:function () {
        this.stopActionByTag(1);
        this.findPathToTarget();

        //tao action quai di chuyen
        var arrayActionMove = [];
        for (var i = 1; i < this.pathToTarget.length; i++) {
            arrayActionMove.push(cc.delayTime(0));
            arrayActionMove.push(cc.moveTo(this.timeToRun, getBoxLocation(this.pathToTarget[i].row, this.pathToTarget[i].col)));

        }
        arrayActionMove.push(cc.callFunc(() => this.removeFromParent()));
        var actionMove = cc.sequence(arrayActionMove);
        actionMove.setTag(1);
        this.runAction(actionMove);

        //tao animation quai di chuyen
        var arrayAnimation = [];
        for (var i = 0; i < this.pathToTarget.length - 1; i++) {
            var direction = this.directionMove(this.pathToTarget[i], this.pathToTarget[i + 1]);
            if (direction == "right") {
                arrayAnimation.push(this.animationTurn(this.startRightFrame, this.endRightFrame, direction));
            } else if (direction == "down") {
                arrayAnimation.push(this.animationTurn(this.startDownFrame, this.endDownFrame, direction));
            } else if (direction == "up") {
                arrayAnimation.push(this.animationTurn(this.startUpFrame, this.endUpFrame, direction));
            }
            else if (direction == "left") {
                console.log("do nothing")
            }
        }
    },

    findPathToTarget : function () {
        // console.log("hello")
        var vitri = getLocationMonsterInMatrix(this.getPosition());
        this.pathToTarget = bFSPath(vitri, {row : fieldSize - 1, col : fieldSize - 1}, findNeighborMonsterCantFly, Obstacle);
    },


});