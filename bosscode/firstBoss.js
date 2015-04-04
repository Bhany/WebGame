function firstBoss(x, y) {
	this.x = x;
	this.y = y;

	this.width = 300;
	this.height = 300;
	this.moveSpeed = 1;
	this.health = 1500;
	this.maxHealth = this.health;
	this.damage = 0;

	this.dx = 0;
	this.dy = 0;

	//array for bullet rain
	this.missiles = [];

	//bullet angle
	this.bulletAngle = 0;

	this.isDead = false;

	/* ****
	this.soundDeath = $("#sound_enemydeath").get(0);
	this.soundDeath.volume = .3;
	*/
}

//determines where to move the enemy
firstBoss.prototype.getMovementDirection = function()
{
	if (this.y > gameHeight/2)
	{
		this.dy = -1;
	}
	if (this.y < gameHeight / 5)
	{
		this.dy = 1;
	}
}

firstBoss.prototype.bulletRain = function()
{
	var xDest = this.x + gameWidth * Math.sin(this.bulletAngle);
	var yDest = this.y + gameHeight * Math.cos(this.bulletAngle);
	this.missiles.push(new Projectile(this.x, this.y, xDest, yDest, 15, "firstBoss"));

	this.bulletAngle++;
}

firstBoss.prototype.update = function() {
	if (this.health <= 0) {
		this.health = 0;
		if (!this.isDead)
		{
			/* ****
			this.soundDeath.currentTime = 0;
			this.soundDeath.play();
			*/

			currentLevel.animations.push(new AnimationSprite(this.x, this.y, "text", ("+" + this.scoreValue), "white", 30));
		}
		this.isDead = true;
		return;
	}

	this.getMovementDirection();
	
	this.x += this.dx;
	this.y += this.dy;

	this.bulletRain();
};

firstBoss.prototype.draw = function() {
	//Draw the border
	game.strokeStyle = "#777777";
	game.strokeRect(this.x, this.y, this.width, this.height);

	//draw the fill
	game.fillStyle = "#777777";
	var strokeHeight = this.height * (this.health / this.maxHealth);
	game.fillRect(this.x,this.y, this.width, strokeHeight);
};

