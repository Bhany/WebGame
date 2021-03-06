function Enemy(x,y,scoreVal,attackdmg, health, speed) {
	this.x = x;
	this.y = y;

	//this.width = 50;
	//this.height = 50;
	this.radius = 25;
	this.scoreValue = scoreVal;
	this.damage = attackdmg;
	this.moveSpeed = speed;

	this.dx = 0;
	this.dy = 0;

	this.isDead = false;
	this.health = health;
	this.maxHealth = this.health;

	this.health += (3*(score/300));
	this.maxHealth += (3*(score/300));

	/* ****
	this.soundDeath = $("#sound_enemydeath").get(0);
	this.soundDeath.volume = .3;
	*/

	// r = argument radius
	/*
	Circle code  

	this.radius = r;
	this.retArea = getTheArea;
	this.retCirc = function () { return ( Math.PI * this.radius * 2 ); };
    this.mvBy = mvCclBy; 
    */
}

/*
Circle code

function getTheArea() {
  return ( Math.PI * this.radius * this.radius );
}
function mvCclBy(xDis,yDis) {
  this.xcoord += xDis;
  this.ycoord += yDis;
}
*/

//determines where to move the enemy
//the enemy just moves towards the player
Enemy.prototype.getMovementDirection = function() {
	var overShot = 0;
	var xMult = 1; 
	var yMult = 1;
	var xDest = player.x + player.width/2;
	var yDest = player.y + player.height/2;

	if (yDest < this.y)
	{
		yMult = -1; 
		yDest -= overShot;
	}
	else yDest += overShot;

	if (xDest < this.x)
	{
		xMult = -1;
		xDest -= overShot;
	}
	else xDest +=overShot;

	var goX = Math.abs(xDest - this.x);
	var goY = Math.abs(yDest - this.y);

	//hypotenuse
	var h = Math.sqrt(Math.pow(goX, 2) + Math.pow(goY, 2));

	//angle the bullet needs to travel
	var angle = Math.asin(goY / h);

	this.dx=Math.cos(angle) * this.moveSpeed * xMult;
	this.dy=Math.sin(angle) * this.moveSpeed * yMult;
};

Enemy.prototype.update = function() {
	if (this.health <= 0) {
		this.health = 0;
		if (!this.isDead)
		{
			score+=this.scoreValue;
			//this.soundDeath.currentTime = 0;
			//this.soundDeath.play();

			currentLevel.animations.push(new AnimationSprite(this.x, this.y, "text", ("+" + this.scoreValue), "white", 30));
		}
		this.isDead = true;
		return;
	}

	this.getMovementDirection();
	
	this.x += this.dx;
	this.y += this.dy;
};

Enemy.prototype.draw = function() {
	//draw the fill
	game.beginPath();
	game.fillStyle = "#FF9800";
	var strokeAngle = (2*Math.PI) * (this.health / this.maxHealth);
	game.arc(this.x,this.y, this.radius, 0, strokeAngle);
	game.closePath();
	game.fill();

	//Draw the border
	game.strokeStyle = "#FF9800";
	game.beginPath();
	game.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
	game.closePath();
	game.stroke();
};
