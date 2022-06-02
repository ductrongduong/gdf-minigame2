var fieldSize = 7;
// var tileTypes = ["land", "rock", "monster", "fly", "giant", "tree"];
var tileSize = 50;
var tileArray = [];
var globezLayer;
var startColor = null;
var arrowsLayer;
var available = new Set();
var numberOfRock = 0;
var numberOfMonster = 0;
var currentRock = 0;
var typeOfMonster = {
    DARK_GIANT : 0,
    FLY : 1,
    LIGHT_GIANT : 2
}
var typeOfObstacle = {
    ROCK : 0,
    TREE : 1
}

