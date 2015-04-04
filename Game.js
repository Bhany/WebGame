//Canvas drawing stuff
var gameCanvas; // gameCanvas is canvas - html element
var game; // JS side
var gameWidth;
var gameHeight;
var refreshRate = 25;
var stars = [];
var starsCountToPaint = 3;
var defaultTextHeight = 50;

//Levels is an array of all levels
//currentLevel is which level the player is on
var player;
var levels;
var currentLevel;
var gameHasStarted = false;

//Images to display objects in the game
var michaelImage;
var milkImage;

//Texts to display
var score = 0;

var gameOver = false;

//Player starting location
var playerStartX;
var playerStartY;

//**** var deathMusic;
//**** var openingMusic;

//used to count ticks of game update
var timer = 0;

//used for death screen
var deathFadeTicks = 0;

$(document).ready(function() { // ready loads all the functions at the open of page
	gameCanvas = $("#game")[0];  // $ selects the element Jquery, #id in index 
	game = gameCanvas.getContext("2d");

	var screenWidth = $(document).width()-40; // document = wholepage
	var screenHeight = $(document).height()-40;

	gameCanvas.width = screenWidth;
	gameCanvas.height = screenHeight;

	gameWidth = $("#game").width();
	gameHeight = $("#game").height();

	playerStartY = gameHeight/2;
	playerStartX = gameWidth/7;

	michaelImage = new Image();
	milkImage = new Image();

	milkImage.src = './images/milk.png';
	michaelImage.src = './images/mike.png';

	//general music
	//**** deathMusic = $("#music_bg_tristesse").get(0);
	//**** openingMusic = $("#music_bg_jupiter").get(0);
	//**** openingMusic.volume = .5;

	//Starts the game fresh. Called when the game restarts or the player loses.
	startGame();

	//Keeps track of player input
	getPlayerCommand();

	//start the opening music
	//**** openingMusic.play();

	game_loop = setInterval(gameLoop, refreshRate); // setInterval takes 2 arg firing 1st func at 2nd arg time
});

//Ive tried to do as much drawing as possible OUTSIDE the game loop to improve performance
//Intro screen / GUI outlines are pre-rendered in this way
function gameLoop() {

	//gameHasStarted checks whether you've hit enter and begun the game
	//gameOver checks whether you have died

	if (timer >= refreshRate)
	{
		timer = 0;
	}

	timer++;

	//if the game hasnt even started, just draw the start screen and let them pause to check instructions
	if (!gameHasStarted)
	{
		drawBackground();

		if (isMenuOpen)
			drawMenu();
		else 
		{
			drawStartScreen();
		}
	}

	//if the game isn't over and it has started, play the game
	if (!gameOver && gameHasStarted) {
		drawBackground();
		if (!isGamePaused) {
			drawStats();
			player.update();
			currentLevel.update();
		}
		else { // game is paused
			drawBackground();
			if (isMenuOpen)
				drawMenu();
		}
	}

	//if the game is over and it already started at some point, you died!
	else if (gameOver && gameHasStarted)
	{
		if (timer == 1)
			deathFadeTicks++;

		drawDeathScreen((deathFadeTicks / 100.0), (deathFadeTicks / 10.0));
		//**** currentLevel.music.pause();
		console.log("death");
		//**** deathMusic.play();
	}
}

function startGame() {

	//***** levels = [new Level($("#music_bg_moonlight").get(0), $("#music_bg_impromptu").get(0))];
	levels = [new Level(null,null)];
	

	currentLevel = levels[0];
	player = new Player(playerStartX, playerStartY);
	deathFadeTicks = 0;
}

//Drawing things outside of the game loop
function drawPreRenderBackground() {

}

//drawn when you die (health = 0 or fall off the map)
function drawDeathScreen(alpha, shadow)
{
	game.globalAlpha = alpha;
	game.fillStyle = "black";
	game.fillRect(0,0, gameWidth, gameHeight);

	game.globalAlpha = 1;
	game.shadowBlur = shadow;
	game.shadowColor = "white";
	game.fillStyle = "white";
	game.font = "50px Verdana";
	game.fillText("You died.", 110, gameHeight / 8 + defaultTextHeight);
	game.fillText("Press Enter to begin the experience anew.", 110, gameHeight / 8 + 2*defaultTextHeight);
	game.shadowBlur = 0;
}


function drawStats() {

	var margin = 25;
	var barWidth = 300;
	var barHeight = 25;
	game.font = "20px Verdana";

	//Paints an outline and then a filled rect which represents percent of health/mana/whatever

	//Health	
	game.fillStyle = "#EB7F00";
	game.fillRect(margin, gameHeight - margin*2, (player.health / player.maxHealth) * barWidth, barHeight);

	//Health bar border
	game.strokeStyle = "#EB7F00";
	game.strokeRect(margin, gameHeight - margin*2, barWidth, barHeight);

	//Health numbers
	game.fillStyle = "white";
	game.fillText("" + Math.floor(player.health) + " / " + player.maxHealth, margin, gameHeight - 5);

	//Mana
	game.fillStyle = "#225378";
	game.fillRect(margin*2 + barWidth, gameHeight - margin*2, (player.mana / player.maxMana) * barWidth, barHeight);

	//Mana bar border
	game.strokeStyle = "#225378";
	game.strokeRect(margin*2 + barWidth, gameHeight - margin*2, barWidth, barHeight);

	//Mana numbers
	game.fillStyle = "white";
	game.fillText("" + Math.floor(player.mana) + " / " + player.maxMana, barWidth + 2*margin, gameHeight - 5);

	//score
	game.fillStyle = "white";
	game.font = "25px Verdana";
	game.fillText("Score: " + score, margin*3 + barWidth*2, gameHeight - margin - 5);
}

function drawStartScreen() {


	game.font = "50px Verdana";
	game.fillText("Welcome to Mike's Dairy Experience", 100, gameHeight / 8);

	game.font = "25px Verdana";
	game.fillText("Press Enter to begin your own dairy experience.", 110, gameHeight / 8 + defaultTextHeight);
	game.fillText("Press Escape at any time for instructions.", 110, gameHeight / 8 + 2*defaultTextHeight);
	game.fillText("You die if you fall below the bottom of the screen!", 110, gameHeight / 8 + 4*defaultTextHeight);
	game.fillText("Destroy the enemies before they destroy you!", 110, gameHeight / 8 + 5*defaultTextHeight);
	game.fillText("Collect milk to regain health and increase your score!", 110, gameHeight / 8 + 6*defaultTextHeight);
}

//Draws all the stars in the background
function drawBackground() {
	game.fillStyle = "#121212";
	game.fillRect(0, 0, gameWidth, gameHeight); 

	
	game.fillStyle = "white";

	if (starsCountToPaint == 3) {
		stars = [];
		for (i = 0; i < 60; i ++) {
			var size = Math.random() * 10;
			stars.push(new star(Math.random() * gameWidth, Math.random() * gameHeight, size));
		}
		starsCountToPaint = 0;
	}

	for (i = 0; i < stars.length; i++)
		stars[i].draw();

	starsCountToPaint++;
	
}

//Exists for the background
function star(x, y, size) {
	this.x = x;
	this.y = y;
	this.size = size;
}

star.prototype.draw = function() {
	game.fillStyle = "white";
	game.fillRect(this.x, this.y, this.size, this.size);
};