//Levels keep track of the enemies, Milks, projectiles, and any other objects in the level.
//Level keeps track of all collision as well
function Level(music, bossMusic) {
	//milk object array
	this.milks = [];

	//enemy object array
	this.enemies = [];

	//player projectiles (rockets, basic attacks, etc)
	this.missiles = [];

	//animation sprite array
	this.animations = [];

	//music stuff
	/* ****
	this.bgmusic = music;
	this.bossMusic = bossMusic;
	this.music = this.bgmusic;
	this.isMusicPaused = false;
	*/


	//spawn timers
	this.enemyTimerMax = 40;;
	this.milkTimerMax = 40;

	this.enemyTimer = 0;
	this.milkTimer = 0;

	this.hasBossSpawned = false;
	this.bossLoaded = false;
}

Level.prototype.spawnMilks = function() 
{
	var randY = Math.random() * gameHeight;
	this.milks.push(new Milk(gameWidth / 1.3, randY));
};

Level.prototype.spawnEnemies = function()
{
	//spawn enemies if boss hasnt spawned yet
	if (!this.hasBossSpawned)
	{
		var randY = Math.random() * gameHeight;
		var randX = Math.random() * gameHeight;

		//dont let enemies spawn on top of the player
		if (Math.abs(randX - player.x) < 100)
			randX += 100;
		//x, y, score value, damage, health, movement speed 
		this.enemies.push(new Enemy(randX, randY, 30, 1, 25, 6));
	}

	//spawn the boss
	if (this.hasBossSpawned && !this.bossLoaded)
	{
		//change to boss music
		/* ****
		this.music.pause();
		this.music = this.bossMusic;
		this.music.currentTime = 0;
		if (!this.isMusicPaused)
		{
			this.music.play();
		}
		*/

		this.bossLoaded = true;

		//clear the array of enemies before spawning boss
		this.enemies.length = 0;
		this.enemies.push(new firstBoss(gameWidth - gameWidth/2, 0));
	}
};

Level.prototype.update = function() {
	//Boss spawn
	if (score >= 30)
	{
		this.hasBossSpawned = true;
	}

	//spawn timers
	this.milkTimer++;
	this.enemyTimer++;

	if (this.enemyTimer >= this.enemyTimerMax)
	{
		this.spawnEnemies();
		this.enemyTimer = 0;
	}

	if (this.milkTimer >= this.milkTimerMax)
	{
		this.spawnMilks();
		this.milkTimer = 0;
	}

	//Missile update
	for (i = 0; i < this.missiles.length; i++) {
		if (this.missiles[i].x > gameWidth || this.missiles[i].x < 0
			|| this.missiles[i].y > gameHeight || this.missiles[i].y < 0
			|| this.missiles[i].shouldRemove) {
			this.missiles.splice(i,1);
		}
		else 
		{
			this.missiles[i].update();
			this.missiles[i].draw();
		}
	}//end missile update

	//Boss update
	if (this.hasBossSpawned)
	{
		//if boss has spawned, enemies[0] is the boss
		var boss = this.enemies[0];
		var m = boss.missiles;

		boss.update();
		boss.draw();

		//if the enemy is dead, remove it from the list
		if (boss.isDead) 
		{
			this.enemies.splice(i, 1);
		}

		//update boss missiles
		for (i = 0; i < m.length; i++)
		{
			if (hasCollidedWithPlayer(m[i]))
			{
				player.health -=.01;
			}
			if (m[i].x > gameWidth || m[i].x < 0
				|| m[i].y > gameHeight || m[i].y < 0
				|| m[i].shouldRemove)
			{
				m.splice(i,1);
			}
			else 
			{
				m[i].update();
				m[i].draw();
			}
		}

	}//end boss update

	//Milk update (also checks collision with player)
	for (i = 0; i < this.milks.length; i++) {
		if (this.milks[i].x + this.milks[i].width < 0) {
			this.milks.splice(i,1);
		}
		else if (hasCollidedWithPlayer(this.milks[i])) {
			if (!this.milks[i].hasBeenPickedUp)
			{
				this.milks[i].pickup();
			}
			else this.milks[i].hasBeenPickedUp = true;

			this.milks.splice(i,1)
		}
		else
		{
			this.milks[i].update();
			this.milks[i].draw();
		}
	}//end milk update

	//Enemy update (also checks collision with missiles)
	for (i = 0; i < this.enemies.length; i++) {
		this.enemies[i].update();
		this.enemies[i].draw();

		//if the enemy is dead, remove it from the list
		if (this.enemies[i].isDead) {
			this.enemies.splice(i, 1);
		}
		
		//missile collision
		else {
			for (j = 0; j < this.missiles.length; j++) {
				if (hasCollided(this.missiles[j],this.enemies[i])) {
					this.missiles[j].interact(this.enemies[i]);
					this.missiles[j].shouldRemove = true;
				}
			}

			//Player collision
			if (hasCollidedWithPlayer(this.enemies[i]))
			{
				//makes sure the player doesnt go below zero health
				if (player.health - this.enemies[i].damage < 0)
					player.health = 0;
				else player.health -= this.enemies[i].damage;
			}
		}
	}//end enemy update

	//AnimationSprite updates
	for (i = 0; i < this.animations.length; i++)
	{
		if (this.animations[i].isDone)
		{
			this.animations.splice(i, 1);
		}

		else
		{
			this.animations[i].animate();
		}
	}//end animation update
};
