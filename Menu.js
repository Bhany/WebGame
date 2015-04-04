var isGamePaused = false;
var isMenuOpen = false;

var currentMenuSelect = "inventory";

function drawMenu() {
	var margin = 25;
	var inventoryWidth = gameWidth / 2;
	var inventoryHeight = gameHeight / 2;

	game.globalAlpha = .5;

	//Grey out background
	game.fillStyle = "black";
	game.fillRect(0,0, gameWidth, gameHeight);

	//draw inventory
	/*
	if (currentMenuSelect = "inventory")
	{
		game.fillStyle = "black";
		game.globalAlpha = .7;
		game.fillRect(margin, margin, inventoryWidth, inventoryHeight);
	}
	*/

	game.globalAlpha = 1;
	game.fillStyle = "white";
	game.font = "50px Verdana";
	game.fillText("Menu", 100, gameHeight / 8);
	game.font = "25px Verdana";
	game.fillText("Press escape to unpause.", 100, gameHeight / 8 + defaultTextHeight);
	game.fillText("Press M to mute music", 100, gameHeight / 6 + defaultTextHeight);
	game.fillText("Click the mouse to activate your currently selected ability.", 100, gameHeight / 8 + 3*defaultTextHeight);
	game.fillText("Press Space to select the 'shoot' ability.", 100, gameHeight / 8 + 4*defaultTextHeight);
	game.fillText("Press E to select the 'teleport' ability.", 100, gameHeight / 8 + 5*defaultTextHeight);
	game.fillText("Press F to select the 'rocket' ability.", 100, gameHeight / 8 + 6*defaultTextHeight);
	game.fillText("Shoot enemies to kill them (with the 'shoot' ability).", 100, gameHeight / 8 + 8*defaultTextHeight);
	game.fillText("Enemies deal damage to you if they collide with you.", 100, gameHeight / 8 + 9*defaultTextHeight);
	game.fillText("Shooting enemies refills your mana. Mana is used for most abilities.", 100, gameHeight / 8 + 10*defaultTextHeight);
}