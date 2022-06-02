function getBoxLocation(row, col) {
    var location = new cc.p(col*tileSize+tileSize/2,row*tileSize+tileSize/2);
    return location;
}

// function getBoxLocation(point) {
//     var location = new cc.p(point.col*tileSize+tileSize/2,point.row*tileSize+tileSize/2);
//     return location;
// }

function findPath(start, destination) {
    const visited = new Set();
    var stack = [];
    stack.push([start]);

    while(stack.length > 0) {
        var path = stack.pop();
        var current = path[path.length - 1];
        var locationTo1D = current.row * fieldSize + current.col;
        if (!visited.has(locationTo1D) && tileArray[current.row][current.col].val == "land") {
            if (current.row == destination.row && current.col == destination.col){
                return path;
            }
            visited.add(locationTo1D);

            var neighbor = this.findNeighbor(current);
            for (var i in neighbor) {
                var path2 = [];
                for (var j in path) {
                    path2.push(path[j]);
                }
                path2.push(neighbor[i]);
                // path.push(neighbor[i]);
                stack.push(path2);
                // path.pop();
            }
        }
    }
    return stack;
}

function findNeighbor (current) {
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
}

function move(next) {
    // var location = getBoxLocation(next.row, next.col);
    var action = cc.MoveTo.create(0.5, getBoxLocation(next.row, next.col));
    // var moveAction= cc.MoveTo.create(2, getBoxLocation(6, 6));
    // monster.runAction(moveAction);
    return action;
}

function getBox1D (box) {
    return box.row * fieldSize + box.col;
}

function putObstacle(row, col) {
    if (!available.has(row * fieldSize + col)) return false;
    let items = Array.from(available);
    var indexTo1D = getBox1D({row: row, col: col});
    available.delete(indexTo1D);

    var obstacle = getRandomObstacle();
    gameLayer.addTile(row, col, obstacle);

    tileArray[row][col] = obstacle;
    // tileArray[row][col].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "rock.png"));
    // tileArray[row][col].val = "rock";
    currentRock++;

    //optimize code find path???
    var path = findPath({row : 0, col : 0}, {row : fieldSize - 1, col : fieldSize - 1});

    if (path.length == 0) {
        tileArray[row][col].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(  "land.png"));
        tileArray[row][col].val = "land";
        currentRock--;
        return false;
    }
    else {
        neighbor = findNeighbor({row : row, col : col});
        for (var i in neighbor) {
            var x = this.getBox1D(neighbor[i]);
            available.delete(x);
        }
        return true;
    }
}

function getBoxInMatrix(event) {
    var pickedRow = Math.floor(event.getLocation().y / tileSize);
    var pickedCol = Math.floor(event.getLocation().x / tileSize);
    return {row : pickedRow, col : pickedCol};
}

function getLocationMonsterInMatrix(loc) {
    var pickedRow = Math.floor(loc.y / tileSize);
    var pickedCol = Math.floor(loc.x / tileSize);
    return {row : pickedRow, col : pickedCol};
}

function bFSPath(start, destination) {
    const visited = new Set();
    var queue = [];
    queue.push([start]);

    while(queue.length > 0) {
        var path = queue.shift();
        var current = path[path.length - 1];
        var locationTo1D = current.row * fieldSize + current.col;
        if (!visited.has(locationTo1D) && tileArray[current.row][current.col].val == "land") {
            if (current.row == destination.row && current.col == destination.col){
                return path;
            }
            visited.add(locationTo1D);

            neighbor = this.findNeighbor(current);
            for (var i in neighbor) {
                var path2 = [];
                for (var j in path) {
                    path2.push(path[j]);
                }
                path2.push(neighbor[i]);
                // path.push(neighbor[i]);
                queue.push(path2);
                // path.pop();
            }
        }
    }
    return queue;
}

// function printAvailable() {
//     var items = Array.from(available);
//     cc.log(JSON.stringify(items));
// }

function getRandomMonster() {
    let random = Math.floor(Math.random() * Object.keys(typeOfMonster).length);
    var monster;
    switch (random) {
        case typeOfMonster.DARK_GIANT:
            monster = new DarkGiant();
            break;
        case typeOfMonster.FLY:
            monster = new Fly();
            break;
        case typeOfMonster.LIGHT_GIANT:
            monster = new LightGiant();
            break;
    }
    return monster;
}

function getRandomObstacle() {
    let random = Math.floor(Math.random() * Object.keys(typeOfObstacle).length);
    var obstacle;
    switch (random) {
        case typeOfObstacle.ROCK:
            obstacle = new Rock();
            break;
        case typeOfObstacle.TREE:
            obstacle = new Tree();
            break;
    }
    return obstacle;
}