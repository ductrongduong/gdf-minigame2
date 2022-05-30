var fieldSize = 6;
var tileTypes = ["red", "green", "blue", "grey", "yellow"];
var tileSize = 50;
var tileArray = [];
var globezLayer;
var startColor = null;
var visitedTiles = [];
var tolerance = 400;
var arrowsLayer;

var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});
var game = cc.Layer.extend({
    init:function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("assets/globes.plist", "assets/globes.png");
        var backgroundLayer = cc.LayerGradient.create(cc.color(0x00,0x22,0x22,255), cc.color(0x22,0x00,0x44,255));
        this.addChild(backgroundLayer);
        globezLayer = cc.Layer.create();
        // new cc.layer() can also be used
        this.addChild(globezLayer);
        arrowsLayer = cc.DrawNode.create();
        // new cc.DrawNode() can also be used
        this.addChild(arrowsLayer);
        this.createLevel();
        cc.eventManager.addListener(touchListener, this);
    },
    createLevel: function() {
        for (var i = 0; i < fieldSize; i++) {
            tileArray[i] = [];
            for (var j = 0; j < fieldSize; j++) {
                this.addTile(i, j);
            }
        }
    },
    addTile:function(row,col){
        var randomTile = Math.floor(Math.random()*tileTypes.length);
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(tileTypes[randomTile]);
        var sprite = cc.Sprite(spriteFrame);
        // new cc.Sprite(spriteFrame) can also be used
        sprite.val = randomTile;
        sprite.picked = false;
        globezLayer.addChild(sprite,0);
        sprite.setPosition(col*tileSize+tileSize/2,row*tileSize+tileSize/2);
        tileArray[row][col] = sprite;
    }
});

var touchListener = cc.EventListener.create({
    event: cc.EventListener.MOUSE,
    onMouseDown: function (event) {
        // console.log("Hello world");
        var pickedRow = Math.floor(event.getLocation().y / tileSize);
        var pickedCol = Math.floor(event.getLocation().x / tileSize);
        tileArray[pickedRow][pickedCol].setOpacity(128);
        tileArray[pickedRow][pickedCol].picked = true;
        startColor = tileArray[pickedRow][pickedCol].val;
        visitedTiles.push({
            row: pickedRow,
            col: pickedCol
        });
    },
    onMouseUp: function(event){
        arrowsLayer.clear();
        startColor=null;
        for(var i = 0; i < visitedTiles.length; i ++){
            if(visitedTiles.length<3) {
                tileArray[visitedTiles[i].row][visitedTiles[i].col].setOpacity(255);
                tileArray[visitedTiles[i].row][visitedTiles[i].col].picked = false;
            }
            else{
                globezLayer.removeChild(tileArray[visitedTiles[i].row][visitedTiles[i].col]);
                tileArray[visitedTiles[i].row][visitedTiles[i].col]=null;
            }
        }
        if(visitedTiles.length>=3){
            for(var i = 1; i < fieldSize; i ++){
                for(j = 0; j < fieldSize; j ++){
                    if(tileArray[i][j] != null){
                        var holesBelow = 0;
                        for(var k = i - 1; k >= 0; k --){
                            if(tileArray[k][j] == null){
                                holesBelow++;
                            }
                        }
                        if(holesBelow>0){
                            // cc.log(JSON.stringify(tileArray[i][j].getPosition()));
                            var moveAction = cc.MoveTo.create(0.5, new cc.p(tileArray[i][j].getPosition().x,
                                tileArray[i][j].getPosition().y-holesBelow*tileSize));
// cc,moveTo() can also be used
                            tileArray[i][j].runAction(moveAction);
                            tileArray[i - holesBelow][j] = tileArray[i][j];
                            tileArray[i][j] = null;
                        }
                    }
                }
            }
            for(i = 0; i < fieldSize; i ++){
                for(j = fieldSize-1; j>=0; j --){
                    if(tileArray[j][i] != null){
                        break;
                    }
                }
                var missingGlobes = fieldSize-1-j;
                if(missingGlobes>0){
                    for(j=0;j<missingGlobes;j++){
                        this.fallTile(fieldSize-j-1,i,missingGlobes-j)
                    }
                }
            }
        }
        visitedTiles = [];
    },
    onMouseMove: function(event){
        if(startColor!=null){
            var currentRow = Math.floor(event.getLocation().y / tileSize);
            var currentCol = Math.floor(event.getLocation().x / tileSize);
            var centerX = currentCol * tileSize + tileSize / 2;
            var centerY = currentRow * tileSize + tileSize / 2;
            var distX = event.getLocation().x - centerX;
            var distY = event.getLocation().y - centerY;
            if(distX * distX + distY * distY < tolerance) {
                if (!tileArray[currentRow][currentCol].picked) {
                    if (Math.abs(currentRow - visitedTiles[visitedTiles.length - 1].row) <= 1 && Math.abs(currentCol -
                        visitedTiles[visitedTiles.length - 1].col) <= 1) {
                        if (tileArray[currentRow][currentCol].val == startColor) {
                            tileArray[currentRow][currentCol].setOpacity(128);
                            tileArray[currentRow][currentCol].picked = true;
                            visitedTiles.push({
                                row: currentRow,
                                col: currentCol
                            });
                        }
                    }
                } else {
                    if (visitedTiles.length >= 2 && currentRow ==
                        visitedTiles[visitedTiles.length - 2].row && currentCol ==
                        visitedTiles[visitedTiles.length - 2].col) {
                        tileArray[visitedTiles[visitedTiles.length - 1].row][visitedTiles[visitedTiles.length - 1].col].setOpacity(255);
                        tileArray[visitedTiles[visitedTiles.length - 1].row][visitedTiles[visitedTiles.length - 1].col].picked = false;
                        visitedTiles.pop();
                    }
                }
                this.drawPath();
            }
        }
    },
    fallTile:function(row,col,height){
        var randomTile = Math.floor(Math.random()*tileTypes.length);
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(tileTypes[randomTile]);
        var sprite = cc.Sprite(spriteFrame);
        sprite.val = randomTile;
        sprite.picked = false;
        globezLayer.addChild(sprite,0);
        sprite.setPosition(col*tileSize+tileSize/2,(fieldSize+height)*tileSize);
        var moveAction = cc.MoveTo.create(0.5, new cc.p(col*tileSize+tileSize/2,row*tileSize+tileSize/2));
        sprite.runAction(moveAction);
        // console.log(JSON.stringify(sprite));
        tileArray[row][col] = sprite;
    },
    drawPath:function(){
        arrowsLayer.clear();
        if(visitedTiles.length>0){
            for(var i=1;i<visitedTiles.length;i++){
                arrowsLayer.drawSegment(new cc.p(visitedTiles[i-1].col*tileSize+tileSize/2,
                        visitedTiles[i-1].row*tileSize+tileSize/2),
                    new cc.p(visitedTiles[i].col*tileSize+tileSize/2,
                        visitedTiles[i].row*tileSize+tileSize/2), 4,
                    cc.color(255, 255, 255, 255));
            }
        }
    }
});

