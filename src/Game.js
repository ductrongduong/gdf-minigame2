
var Game = cc.Layer.extend({
    init:function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("assets/art.plist", "assets/art.png");
        var backgroundLayer = cc.LayerGradient.create(cc.color(0x00,0x22,0x22,255), cc.color(0x22,0x00,0x44,255));
        this.addChild(backgroundLayer);
        globezLayer = cc.Layer.create();

        var restartButton = new RestartButton();
        this.addChild(restartButton);
        restartButton.zIndex = 2;

        // var possibleEnemies = [Fly, DarkGiant];
        // let enemy = new possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)]();
        // var x = new enemy();
        // console.log(JSON.stringify(x));
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
                if(putObstacle(locationInMatrix.row, locationInMatrix.col) && check){
                    // console.log(JSON.stringify(locationInMatrix));
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

    },


    createLevel: function() {
        for (var i = 0; i < fieldSize; i++) {
            tileArray[i] = [];
            for (var j = 0; j < fieldSize; j++) {
                // this.addTile(i, j, "land");
                var land = new Land();
                this.addTile(i, j, land);
            }
        }
    },


    addTile:function(row,col, sprite){
        // var spriteFrame = cc.spriteFrameCache.getSpriteFrame(type + ".png");
        // var sprite = cc.Sprite(spriteFrame);
        // sprite.val = type;
        // sprite.picked = false;
        if(tileArray[row][col] != null)
            this.removeChild(tileArray[row][col]);
        globezLayer.addChild(sprite,0);
        sprite.setPosition(getBoxLocation(row, col));
        tileArray[row][col] = sprite;
        // tileArray[row][col].val = type;
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
            putObstacle(row, col);
        }

    },


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
        var monster = getRandomMonster();
        this.addChild(monster, 1);
        monster.zIndex = 10;
    }

});

var RestartButton = ccui.Button.extend({
    ctor:function() {
        this._super();
        this.setTitleText("Restart game");
        this.setPosition(cc.winSize.width / 2, cc.winSize.height * 9 / 10);
        this.setTitleFontSize(20);
        this.addClickEventListener(this.restartGame);
    },
    restartGame:function () {
        gameLayer.removeFromParent();
         available = new Set();
         numberOfMonster = 0;
         currentRock = 0;
        tileArray = [];
        cc.director.runScene(new GameScene());
    }
})




