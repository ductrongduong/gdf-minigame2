var fieldSize = 7;
var tileTypes = ["land", "rock", "monster"];
var tileSize = 50;
var tileArray = [];
var globezLayer;
var startColor = null;
var visitedTiles = [];
// var tolerance = 400;
var arrowsLayer;
const available = new Set();
var numberOfRock = 0;
var numberOfMonster = 0;
var currentRock = 0;

