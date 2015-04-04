//Milk class. Things you collect
function Milk(x, y) {
	this.x = x;
	this.y = y;
	this.width;
	this.height;
	this.speed = 3;
	this.shouldRemove = false;

	//Amount to increase player's health/score when this milk is picked up
	this.hasBeenPickedUp = false;
	this.scoreValue = 25;
	this.healthValue = 10;
	/* ****
	this.soundPickup = $("#sound_milk").get(0);
	this.soundPickup.volume = .4;
	*/
}

//Draws and updates the platform  
Milk.prototype.update = function() {
	this.x-=this.speed;
	this.width = milkImage.width/5;
	this.height = milkImage.height/5;
};

Milk.prototype.draw = function() {
	game.drawImage(milkImage, this.x, this.y, this.width, this.height);
};

Milk.prototype.pickup = function() {
	score+=this.scoreValue;
	/* ****
	this.soundPickup.currentTime = 0;
	this.soundPickup.play();
	*/

	//makes sure the player's health doesnt go above the max
	if (player.health + this.healthValue > player.maxHealth)
		player.health = player.maxHealth;
	else player.health += this.healthValue;

	currentLevel.animations.push(new AnimationSprite(this.x, this.y, "text", ("+" + this.scoreValue), "white", 30));
};

//Projectile class
//types: basic, rocket, firstBoss
function Projectile(x, y, xDest, yDest, speed, type) {
	this.manaVal = 5;
	this.x = x;
	this.y = y;
	this.xDest = xDest;
	this.yDest = yDest;
	this.speed = speed;
	this.shouldRemove = false;
	this.type = type;

	var goX = Math.abs(xDest - this.x);
	var goY = Math.abs(yDest - this.y);

	//hypotenuse
	var h = Math.sqrt(Math.pow(goX, 2) + Math.pow(goY, 2));

	//angle the bullet needs to travel
	this.angle = Math.asin(goY / h);

	this.xMult = 1; 
	this.yMult = 1;

	if (this.yDest < this.y)
		this.yMult = -1;
	if (this.xDest < this.x)
		this.xMult = -1;
}

Projectile.prototype.update = function() {
	this.x+=Math.cos(this.angle) * this.speed * this.xMult;
	this.y+=Math.sin(this.angle) * this.speed * this.yMult;
};

Projectile.prototype.draw = function() {
	if (this.type == "basic")
	{
		game.fillStyle = "#1695A9";
		game.fillRect(this.x, this.y, 10, 10);
	}

	else if (this.type = "rocket")
	{
		game.fillStyle = "#1695A3";
		game.fillRect(this.x, this.y, 20, 20);
	}
};

//called when the projectile collides with something
//works differently depending on what type of projectile it is
Projectile.prototype.interact = function(obj) {

	//basic attacks just hit a single enemy and restore mana
	if (this.type == "basic")
	{
		var damage = 5;
		obj.health -= damage;
		if (obj instanceof Enemy)
		{
			//makes sure the player doesnt go above max mana
			if (player.mana + this.manaVal > player.maxMana)
				player.mana = player.maxMana;
			else player.mana += this.manaVal;
		}
	}

	//rockets explode and hit multiple enemies
	else if (this.type == "rocket")
	{
		var damage = 10;
		var radius = 250;

		//explosion animation
		currentLevel.animations.push(new AnimationSprite(this.x, this.y, "explosion"));

		//find enemies in explosive radius and damage them
		for (i = 0; i < currentLevel.enemies.length; i++)
		{
			if (isWithinRadius(this.x, this.y, currentLevel.enemies[i], radius))
			{
				currentLevel.enemies[i].health -= damage;
			}
		}
	}
}

//animation class
/*Current types:
	- Explosion (for when rockets collide with things)
	- Text (for score and other things)
*/
function AnimationSprite(x, y, type, textString, textColor, textSize)
{
	this.x = x;
	this.y = y;
	this.type = type;
	this.timer = 0;

	//only used for text animations
	this.textString = textString;
	this.textColor = textColor;
	this.textSize = textSize;

	//how long to play the animation
	this.length;

	//checks if the animation is over
	this.isDone = false;

	//each type of animation lasts a different amount
	if (this.type == "explosion")
	{
		this.length = 15;
	}

	if (this.type == "text")
	{
		this.length = 30;
	}
}

//draws and updates the animation
AnimationSprite.prototype.animate = function()
{
	this.timer++;
	if (this.timer >= this.length)
	{
		this.isDone = true;
		return;
	}

	if (this.type == "text")
	{
		game.globalAlpha = 1 - (this.timer / this.length);
		game.fillStyle = this.textColor;
		game.font = "" + this.textSize + "px Verdana";
		game.fillText(this.textString, this.x, this.y - (this.timer*2));
		game.globalAlpha = 1;
	}

	if (this.type == "explosion")
	{
		//red outer circle
		game.beginPath();
		game.fillStyle = "#FF002C";
		game.arc(this.x, this.y, 10*(this.length / this.timer), 0, 2*Math.PI);
		game.fill();

		//yellow middle circle
		game.beginPath();
		game.fillStyle = "#FFD100";
		game.arc(this.x, this.y, 7*(this.length / this.timer), 0, 2*Math.PI);
		game.fill();

		//inner white circle
		game.beginPath();
		game.fillStyle = "#F7F5FF";
		game.arc(this.x, this.y, 3*(this.length / this.timer), 0, 2*Math.PI);
		game.fill();
	}
}

//returns whether obj is within radius of the point specified by x,y
function isWithinRadius(x, y, obj, radius) {
	return (Math.abs(x) - Math.abs(obj.x) <= radius) && (Math.abs(y) - Math.abs(obj.y) <= radius);
}

//global function to check collision with player
function hasCollidedWithPlayer(obj) {
	return !(((obj.y + obj.height) < player.y)
			|| (obj.y > (player.y + player.height))
			|| (obj.x > (player.x + player.width))
			|| ((obj.x + obj.width) < player.x));
}

//global function to check collision between any two objects
function hasCollided(obj1, obj2) {
	return (obj1.x > obj2.x && obj1.x < obj2.x + obj2.width
			&& obj1.y > obj2.y && obj1.y < obj2.y + obj2.height);
}