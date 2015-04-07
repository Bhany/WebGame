var isDDown = false;
var isADown = false;
var isSpaceDown = false;
var isWDown = false;
var isMouseDown = false;

var mouseX=0;
var mouseY=0;

var manaRegen = .2;

//abilities, these point to functions
var abilityOne;
var abilityTwo;
var abilityThree;

//the ability currently being selected, press Mouse to use it
var currentAbility = basicAttack;

//Player
function Player(x, y) {
	this.x = x;
	this.y = y;
	this.width;
	this.height;
	this.speed = 3;
	this.maxHealth = 100;
	this.health = 100;

	this.maxMana = 125;
	this.mana = 125;

	this.dx = 0;
	this.dy = 0;
	this.speedCap = 10;
	this.isOnGround = false;

	//sets available abilities
	abilityOne = teleport;
	abilityTwo = rocket;
	abilityThree = laserBeam;

	//sounds
	/* ****
	this.soundRocket = $("#sound_rocket").get(0);
	this.soundTeleport = $("#sound_teleport").get(0);

	this.soundTeleport.volume = .1;
	this.soundRocket.volume = .1;
	*/
}

Player.prototype.update = function() {
	//Cap mana and health
	if (this.mana < this.maxMana)
		this.mana += manaRegen;

	if (this.mana > this.maxMana)
		this.mana = this.maxMana;

	if (this.health > this.maxHealth) // max health
		this.health = this.maxHealth;

	//player death conditions
	if (this.y > gameHeight || this.health <= 0)
		gameOver = true;

	//Checks keyboard/mouse input
	if (isADown)
		this.dx -= this.speed;
	else if (isDDown)
		this.dx += this.speed;
	if (isWDown)
		this.dy -= this.speed * 2;

	//checks if mouse is being held down
	if (isMouseDown) {}

	//Draws the player
    
	this.width = michaelImage.width/7;
	this.height = michaelImage.height/7;
	game.fillRect(this.x,this.y, this.width, this.height);
	// game.drawImage(michaelImage, this.x, this.y, this.width, this.height);

	//Movement

	//Caps movement speed
	if (this.dx > this.speedCap)
		this.dx = this.speedCap;
	else if (this.dx < this.speedCap * (-1))
		this.dx = (-1)*this.speedCap;

	if (this.dy > this.speedCap)
		this.dy = this.speedCap;
	else if (this.dy < this.speedCap * (-1))
		this.dy = (-1)*this.speedCap;

	//Actually moves the player
	this.x+=this.dx;
	this.y+=this.dy;

	//Slows down the player left and right, but makes sure they dont move backwards.
	//The player just slows down to 0 speed at all times, always deccelerating.
	if (Math.abs(this.dx) > 0)
		if (this.dx < 0)
			this.dx+=.5;
		else
			this.dx-=.5;

	//Gravity, keeps the player moving down at all times
	if (this.dy < 0)
		this.dy+=.5;

	if (!this.isOnGround)
		this.dy+=.5;
};

//controls
function getPlayerCommand() {
	//Gets the mouse position at all times. No need to use "e" to get it in each function
	$(document).mousemove(function(e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	});

	//When the user clicks on the canvas
	$("#game").mousedown(function(e) {
		currentAbility();
	});

	//Detects key presses
	$(document).keydown(function(e) {
		//Move Up
		if (e.which === moveUpKey) {
			isWDown = true;
		}

		//Move Right
		if (e.which === moveRightKey) {
			isDDown = true;
		}

		//Move Left
		if (e.which === moveLeftKey) {
			isADown = true;
		}

		//Abilities
		if (e.which == abilityOneKey) {
			currentAbility = abilityOne;
		}

		if (e.which == abilityTwoKey) {
			currentAbility = abilityTwo;
		}

		if (e.which == abilityThreeKey) {
			currentAbility = abilityThree;
		}

		if (e.which == basicAttackKey) {
			currentAbility = basicAttack;
		}

		//pause music
		/* ****
		if (e.which == muteMusicKey) {
			if (currentLevel.isMusicPaused)
			{
				currentLevel.music.play();
				currentLevel.isMusicPaused = false;
			}
			else 
			{
				currentLevel.music.pause();
				currentLevel.isMusicPaused = true;
			}
		}
		*/

		//Start game or restart game
		if (e.which == EnterKey) {
			if (!gameHasStarted)
			{
				gameHasStarted = true;
				gameOver = false;
				startGame();


				/* ****
				openingMusic.pause();
				openingMusic.currentTime = 0;

				currentLevel.music.currentTime = 0;
				currentLevel.music.play();
				*/
			}

			else if (gameOver)
			{
				gameHasStarted = false;
				gameOver = false;
				/* ****
				deathMusic.pause();
				deathMusic.currentTime = 0;

				openingMusic.play();
				*/
			}
		}

		//Menu
		if (!gameOver && e.which == menuKey)
		{
			if (isMenuOpen)
				isMenuOpen = false;
			else if (!isMenuOpen)
				isMenuOpen = true;

			if (isGamePaused)
			{
				/* ****
				if (gameHasStarted)
					currentLevel.music.play();
				*/
				isGamePaused = false;
			}
			else if (!isGamePaused)
			{
				//**** currentLevel.music.pause();
				isGamePaused = true;
			}
		}
	});

	//When a key is released, the player stops moving in that direction
	$(document).keyup(function(e) {
		if (e.which == moveRightKey) 
			isDDown = false;
		else if (e.which == moveLeftKey)
			isADown = false;
		else if (e.which == moveUpKey) 
			isWDown = false;
	});
}

//Key Bindings
var moveUpKey = 87; //default W
var moveLeftKey = 65; //default A
var moveRightKey = 68; //default D
var EnterKey = 13; //default Enter
var inventoryKey = 73; //default I
var menuKey = 27; //default Escape
var basicAttackKey = 32; //default Space
var abilityOneKey = 69; //default E
var abilityTwoKey = 70; //default F
var abilityThreeKey = 71; //default G
var muteMusicKey = 77; //default M


//Abilities
function laserBeam() {
	var manaCost = 1;
	if (gameHasStarted && player.mana >= manaCost)
	{
		player.mana -= manaCost;
	}
}

function basicAttack() {
	if(gameHasStarted)
	{
		//player.height/2 etc accounts for the x/y being top left corner
		currentLevel.missiles.push(new Projectile(player.x + player.width/2, player.y + player.height/2,
		mouseX, mouseY, 25, "basic"));
	}
}

function rocket() {
	var manaCost = 30;
	if (gameHasStarted && player.mana >= manaCost)
	{
		player.mana -= manaCost;
		currentLevel.missiles.push(new Projectile(player.x + player.width/2, player.y + player.height/2,
		mouseX, mouseY, 15, "rocket"));

		/* ****
		player.soundRocket.currentTime = 0;
		player.soundRocket.play();
		*/
	}
}

function teleport() {
	var manaCost = 25;
	if (gameHasStarted && player.mana >= manaCost) 
	{
		player.mana -= manaCost;
		player.x = mouseX - player.width/2;
		player.y = mouseY - player.height/2;

		/* ****
		player.soundTeleport.currentTime = 0;
		player.soundTeleport.play();
		*/
	}
}