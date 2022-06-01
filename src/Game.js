
var Game = cc.Layer.extend({
    init:function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("assets/art-minigame2.plist", "assets/art-minigame2.png");
        var backgroundLayer = cc.LayerGradient.create(cc.color(0x00,0x22,0x22,255), cc.color(0x22,0x00,0x44,255));
        this.addChild(backgroundLayer);
        globezLayer = cc.Layer.create();


        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event){

            },
            onMouseUp: function(event){
                var locationInMatrix = getBoxInMatrix(event);
                var check = false;
                var path = bFSPath({row : 0, col : 0}, {row : fieldSize - 1, col : fieldSize - 1});
                for (var i in path) {
                    if (locationInMatrix.row == path[i].row && locationInMatrix.col == path[i].col) {
                        check = true;
                        break;
                    }
                }
                if(putStone(locationInMatrix.row, locationInMatrix.col) && check){
                    arrowsLayer.clear();
                    gameLayer.drawPath();
                    var childs = gameLayer.getChildren();
                    for (var i in childs) {
                        if (childs[i] instanceof Monster) {
                            childs[i].action();
                        }
                    }
                }
            }
        },this)

        // new cc.layer() can also be used
        this.addChild(globezLayer);
        arrowsLayer = cc.DrawNode.create();
        // new cc.DrawNode() can also be used
        this.addChild(arrowsLayer);
        this.genMap();
        this.drawPath();
        this.drawPath();
        this.scheduleUpdate();
        this.schedule(this.addMonster,1.5);
        // this.createLevel()
        // cc.eventManager.addListener(touchListener, this);
        // console.log(JSON.stringify(this.findPath({row: 0, col: 0}, {row: 6, col : 6})));
        // this.drawPath();
    },


    createLevel: function() {
        for (var i = 0; i < fieldSize; i++) {
            tileArray[i] = [];
            for (var j = 0; j < fieldSize; j++) {
                this.addTile(i, j, "land");
            }
        }
        // this.addTile(5, 5, "rock");
    },


    addTile:function(row,col, type){
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(type + ".png");
        var sprite = cc.Sprite(spriteFrame);
        sprite.val = type;
        sprite.picked = false;
        globezLayer.addChild(sprite,0);
        sprite.setPosition(getBoxLocation(row, col));
        tileArray[row][col] = sprite;
        tileArray[row][col].val = type;
    },


    genMap:function () {
        this.createLevel();
        for (var i = 0; i <= (fieldSize - 1)*fieldSize + fieldSize - 1; i++) {
            available.add(i);
        }
        while (currentRock < numberOfRock && available.size > 0) {
            //data structure??
            let items = Array.from(available);
            var random = Math.floor(Math.random() * items.length);
            var row = Math.floor(items[random] / fieldSize);
            var col = items[random] % fieldSize;
            putStone(row, col);
            // tileArray[row][col].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "rock.png"));
            // tileArray[row][col].val = "rock";
            // currentRock++;
            //
            // //optimize code find path???
            // var path = findPath({row : 0, col : 0}, {row : fieldSize - 1, col : fieldSize - 1});
            // // console.log(JSON.stringify(path));
            //
            // if (path.length == 0) {
            //     available.delete(items[random]);
            //     tileArray[row][col].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "land.png"));
            //     tileArray[row][col].val = "land";
            //     currentRock--;
            // }
            // else {
            //     available.delete(items[random]);
            //     neighbor = findNeighbor({row : row, col : col});
            //     for (var i in neighbor) {
            //         var x = this.getBox1D(neighbor[i]);
            //         available.delete(x);
            //     }
            // }
        }
        // for (var i = 0; i < fieldSize; i++) {
        //     for (var j = 0; j < fieldSize; j++) {
        //         console.log(JSON.stringify( tileArray[i][j].val));
        //     }
        // }

    },


    // getBox1D:function (box) {
    //     return box.row * fieldSize + box.col;
    // },

    drawPath:function(){
        arrowsLayer.clear();
        var path = bFSPath({row : 0, col : 0}, {row : fieldSize - 1, col : fieldSize - 1});
        if(path.length>0){
            for(var i=1;i<path.length;i++){
                arrowsLayer.drawSegment(new cc.p(path[i-1].col*tileSize+tileSize/2,
                    path[i-1].row*tileSize+tileSize/2),
                    new cc.p(path[i].col*tileSize+tileSize/2,
                        path[i].row*tileSize+tileSize/2), 4,
                    cc.color(255, 255, 255, 255));
            }
        }
    },

    addMonster:function(event){
        numberOfMonster++;
        // console.log(numberOfMonster);
        var monster = new Monster();
        this.addChild(monster, 1);
        monster.zIndex = 10;
        // monster.runAction({row : 6, col : 6});
        // var moveAction= cc.MoveTo.create(2, getBoxLocation(6, 6));
        // this.runAction(moveAction);
        // console.log("hello")
    }


});




