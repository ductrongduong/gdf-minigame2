
var Game = cc.Layer.extend({
    init:function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("assets/test2.plist", "assets/test2.png");
        var backgroundLayer = cc.LayerGradient.create(cc.color(0x00,0x22,0x22,255), cc.color(0x22,0x00,0x44,255));
        this.addChild(backgroundLayer);
        globezLayer = cc.Layer.create();
        // new cc.layer() can also be used
        this.addChild(globezLayer);
        arrowsLayer = cc.DrawNode.create();
        // new cc.DrawNode() can also be used
        this.addChild(arrowsLayer);
        this.genMap();
        this.drawPath();
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
        var randomTile = Math.floor(Math.random()*tileTypes.length);
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(type + ".png");
        var sprite = cc.Sprite(spriteFrame);
        // new cc.Sprite(spriteFrame) can also be used
        // var sprite = new RockBox();
        sprite.val = type;
        sprite.picked = false;
        globezLayer.addChild(sprite,0);
        sprite.setPosition(col*tileSize+tileSize/2,row*tileSize+tileSize/2);
        tileArray[row][col] = sprite;
        tileArray[row][col].val = type;
    },
    genMap:function () {
        this.createLevel();
        for (var i = 0; i <= (fieldSize - 1)*fieldSize + fieldSize - 1; i++) {
            available.add(i);
        }
        var currentRock = 0;
        while (currentRock < numberOfRock && available.size > 0) {
            let items = Array.from(available);
            var random = Math.floor(Math.random() * items.length);
            var row = Math.floor(items[random] / fieldSize);
            var col = items[random] % fieldSize;
            tileArray[row][col].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "rock.png"));
            tileArray[row][col].val = "rock";
            currentRock++;
            var path = this.findPath({row : 0, col : 0}, {row : fieldSize - 1, col : fieldSize - 1});
            // console.log(JSON.stringify(path));

            if (path.length == 0) {
                available.delete(items[random]);
                tileArray[row][col].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "land.png"));
                tileArray[row][col].val = "land";
                currentRock--;
            }
            else {
                available.delete(items[random]);
                neighbor = this.findNeighbor({row : row, col : col});
                for (var i in neighbor) {
                    var x = this.getBox1D(neighbor[i]);
                    available.delete(x);
                }
            }
        }
        // for (var i = 0; i < fieldSize; i++) {
        //     for (var j = 0; j < fieldSize; j++) {
        //         console.log(JSON.stringify( tileArray[i][j].val));
        //     }
        // }

    },
    getBox1D:function (box) {
        return box.row * fieldSize + box.col;
    },
    findNeighbor:function (current) {
        var neighbor = [];
        if (current.row + 1 >= 0 && current.row + 1 < fieldSize)
            neighbor.push({row : current.row+1, col : current.col});
        if (current.row - 1 >= 0 && current.row - 1 < fieldSize)
            neighbor.push({row : current.row-1, col : current.col});
        if (current.col + 1 >= 0 && current.col + 1 < fieldSize)
            neighbor.push({row : current.row, col : current.col + 1});
        if (current.col - 1 >= 0 && current.col - 1 < fieldSize)
            neighbor.push({row : current.row, col : current.col - 1});
        return neighbor;
    },
    findPath:function(start, destination) {
        const visited = new Set();
        var stack = [];
        stack.push([start]);

        while(stack.length > 0) {
            // console.log(stack.length);
            var path = stack.pop();
            // console.log(JSON.stringify(path));
            var current = path[path.length - 1];
            // console.log(JSON.stringify(current));
            var locationTo1D = current.row * fieldSize + current.col;
            // console.log(JSON.stringify(!visited.has(current)));
            if (!visited.has(locationTo1D) && tileArray[current.row][current.col].val == "land") {
                if (current.row == destination.row && current.col == destination.col){
                    return path;
                }
                visited.add(locationTo1D);
                // console.log(JSON.stringify(current));

                neighbor = this.findNeighbor(current);
                for (var i in neighbor) {
                    var path2 = [];
                    for (var j in path) {
                        path2.push(path[j]);
                    }
                    path2.push(neighbor[i]);
                    // path.push(neighbor[i]);
                    // console.log(JSON.stringify(path[path.length - 1]));
                    stack.push(path2);
                    // path.pop();
                }
            }
        }
        return stack;
    },
    drawPath:function(){
        var path = this.findPath({row : 0, col : 0}, {row : fieldSize - 1, col : fieldSize - 1});
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
});

// var touchListener = cc.EventListener.create({
//     event: cc.EventListener.MOUSE,
//     onMouseDown: function (event) {
//
//         // console.log("Hello world");
//         var pickedRow = Math.floor(event.getLocation().y / tileSize);
//         var pickedCol = Math.floor(event.getLocation().x / tileSize);
//         tileArray[pickedRow][pickedCol].setOpacity(128);
//         tileArray[pickedRow][pickedCol].picked = true;
//         startColor = tileArray[pickedRow][pickedCol].val;
//         visitedTiles.push({
//             row: pickedRow,
//             col: pickedCol
//         });
//     },
//     onMouseUp: function(event){
//         arrowsLayer.clear();
//         startColor=null;
//         for(var i = 0; i < visitedTiles.length; i ++){
//             if(visitedTiles.length<3) {
//                 tileArray[visitedTiles[i].row][visitedTiles[i].col].setOpacity(255);
//                 tileArray[visitedTiles[i].row][visitedTiles[i].col].picked = false;
//             }
//             else{
//                 globezLayer.removeChild(tileArray[visitedTiles[i].row][visitedTiles[i].col]);
//                 tileArray[visitedTiles[i].row][visitedTiles[i].col]=null;
//             }
//         }
//         if(visitedTiles.length>=3){
//             for(var i = 1; i < fieldSize; i ++){
//                 for(j = 0; j < fieldSize; j ++){
//                     if(tileArray[i][j] != null){
//                         var holesBelow = 0;
//                         for(var k = i - 1; k >= 0; k --){
//                             if(tileArray[k][j] == null){
//                                 holesBelow++;
//                             }
//                         }
//                         if(holesBelow>0){
//                             // cc.log(JSON.stringify(tileArray[i][j].getPosition()));
//                             var moveAction = cc.MoveTo.create(0.5, new cc.p(tileArray[i][j].getPosition().x,
//                                 tileArray[i][j].getPosition().y-holesBelow*tileSize));
// // cc,moveTo() can also be used
//                             tileArray[i][j].runAction(moveAction);
//                             tileArray[i - holesBelow][j] = tileArray[i][j];
//                             tileArray[i][j] = null;
//                         }
//                     }
//                 }
//             }
//             for(i = 0; i < fieldSize; i ++){
//                 for(j = fieldSize-1; j>=0; j --){
//                     if(tileArray[j][i] != null){
//                         break;
//                     }
//                 }
//                 var missingGlobes = fieldSize-1-j;
//                 if(missingGlobes>0){
//                     for(j=0;j<missingGlobes;j++){
//                         this.fallTile(fieldSize-j-1,i,missingGlobes-j)
//                     }
//                 }
//             }
//         }
//         visitedTiles = [];
//     },
//     onMouseMove: function(event){
//         if(startColor!=null){
//             var currentRow = Math.floor(event.getLocation().y / tileSize);
//             var currentCol = Math.floor(event.getLocation().x / tileSize);
//             var centerX = currentCol * tileSize + tileSize / 2;
//             var centerY = currentRow * tileSize + tileSize / 2;
//             var distX = event.getLocation().x - centerX;
//             var distY = event.getLocation().y - centerY;
//             if(distX * distX + distY * distY < tolerance) {
//                 if (!tileArray[currentRow][currentCol].picked) {
//                     if (Math.abs(currentRow - visitedTiles[visitedTiles.length - 1].row) <= 1 && Math.abs(currentCol -
//                         visitedTiles[visitedTiles.length - 1].col) <= 1) {
//                         if (tileArray[currentRow][currentCol].val == startColor) {
//                             tileArray[currentRow][currentCol].setOpacity(128);
//                             tileArray[currentRow][currentCol].picked = true;
//                             visitedTiles.push({
//                                 row: currentRow,
//                                 col: currentCol
//                             });
//                         }
//                     }
//                 } else {
//                     if (visitedTiles.length >= 2 && currentRow ==
//                         visitedTiles[visitedTiles.length - 2].row && currentCol ==
//                         visitedTiles[visitedTiles.length - 2].col) {
//                         tileArray[visitedTiles[visitedTiles.length - 1].row][visitedTiles[visitedTiles.length - 1].col].setOpacity(255);
//                         tileArray[visitedTiles[visitedTiles.length - 1].row][visitedTiles[visitedTiles.length - 1].col].picked = false;
//                         visitedTiles.pop();
//                     }
//                 }
//                 this.drawPath();
//             }
//         }
//     },
//     fallTile:function(row,col,height){
//         var randomTile = Math.floor(Math.random()*tileTypes.length);
//         var spriteFrame = cc.spriteFrameCache.getSpriteFrame(tileTypes[randomTile]);
//         var sprite = cc.Sprite(spriteFrame);
//         sprite.val = randomTile;
//         sprite.picked = false;
//         globezLayer.addChild(sprite,0);
//         sprite.setPosition(col*tileSize+tileSize/2,(fieldSize+height)*tileSize);
//         var moveAction = cc.MoveTo.create(0.5, new cc.p(col*tileSize+tileSize/2,row*tileSize+tileSize/2));
//         sprite.runAction(moveAction);
//         // console.log(JSON.stringify(sprite));
//         tileArray[row][col] = sprite;
//     },
//     drawPath:function(){
//         arrowsLayer.clear();
//         if(visitedTiles.length>0){
//             for(var i=1;i<visitedTiles.length;i++){
//                 arrowsLayer.drawSegment(new cc.p(visitedTiles[i-1].col*tileSize+tileSize/2,
//                         visitedTiles[i-1].row*tileSize+tileSize/2),
//                     new cc.p(visitedTiles[i].col*tileSize+tileSize/2,
//                         visitedTiles[i].row*tileSize+tileSize/2), 4,
//                     cc.color(255, 255, 255, 255));
//             }
//         }
//     },
//
//
// });

