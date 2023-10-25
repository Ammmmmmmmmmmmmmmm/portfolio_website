class scene2 extends Phaser.Scene {

	constructor() {
		super("playGame");
	}


	moveShip(ship, speed) {
		ship.y += speed;
		if (ship.y > this.game.config.height) {
			this.resetShipPos(ship);
		}
	}

	resetShipPos(ship){
		ship.y = 0;
		var randomX = Phaser.Math.Between(10, this.game.config.width-10);
		ship.x = randomX;

	}
/*
	destroyShip(pointer, gameObject) {
    
    this.resetShipPos(gameObject);
    const explosionSprite = this.add.sprite(gameObject.x, gameObject.y, "explosion");
    explosionSprite.setScale(15);
    explosionSprite.play("explode");
    this.explosionSound.play();
    this.score+=15;
	this.scoreFormated = this.zeroPad(this.score, 6);
	this.scoreLabel.text = "SCORE "+ this.scoreFormated;
    resetShipPos(enemy);
	}
*/
	zeroPad(number, size) {
		var stringNumber = String(number);
		while(stringNumber.length < (size || 2)){
			stringNumber = "0" + stringNumber;
		}
		return stringNumber;
	}


	movePlayerManager(){

		if(this.cursorKeys.left.isDown){
			this.p_ship.setVelocityX(-gameSettings.playerSpeed);
		}else if(this.cursorKeys.right.isDown){
			this.p_ship.setVelocityX(gameSettings.playerSpeed);
		} else{
			this.p_ship.setVelocityX(0);
		}
		if(this.cursorKeys.up.isDown){
			this.p_ship.setVelocityY(-gameSettings.playerSpeed);
		}else if(this.cursorKeys.down.isDown){
			this.p_ship.setVelocityY(gameSettings.playerSpeed);
		} else {
			this.p_ship.setVelocityY(0);
		}

	}

	//mobile integration

	handleOrientation(event) {
	    const beta = event.beta; // Use the beta value for pitch
	    const gamma = event.gamma; // Use the gamma value for roll

	    // Tweak the sensitivity based on your game's needs
	    const sensitivity = 0.02;

	    // Update player's ship position based on gyroscope data
	    this.p_ship.setVelocityX(gamma * sensitivity);
	    this.p_ship.setVelocityY(beta * sensitivity);
	}



	shootBeam(){
			if (this.beamCooldown) {
		        return; 
		    } else if (this.is_alive){

			var beam = new Beam(this,this.p_ship.x, this.p_ship.y );
			this.beamSound.play();
			this.beamCooldown = true;
		    this.time.addEvent({
		        delay: 1100, 
		        callback: () => {
		            this.beamCooldown = false; 
		        },

		    });

		}
	}
	pickPowerUp(player, powerUp) {
		powerUp.disableBody(true, true);
		this.pickupSound.play();
	}

	hurtPlayer(p_ship, enemy) {

		this.p_ship.setInteractive({ draggable: false });
		this.p_ship.setAlpha(0);
		this.p_ship.x = 3000;
		this.p_ship.y = 3000;

		var explosionSprite1 = this.add.sprite(p_ship.x, p_ship.y, "explosion");
		var explosionSprite2 = this.add.sprite(enemy.x, enemy.y, "explosion");
    	explosionSprite1.setScale(15);
    	explosionSprite1.play("explode");
		explosionSprite2.setScale(15);
    	explosionSprite2.play("explode");
    	this.p_ship.setCollideWorldBounds(false);
    	p_ship.x = 200000
    	p_ship.y = 200000
		enemy.destroy();
		this.explosionSound.play();
		this.music.stop();
		this.comingSound.stop();
		this.leavingSound.stop();
		this.is_alive = false; 
		this.hornSound.play();
		window.removeEventListener("deviceorientation", this.handleOrientation, true);


		setTimeout(() => {

		if (this.score > localStorage.getItem("highscore")) {
		    localStorage.setItem("highscore", this.score);
		}
        this.scene.start("bootGame");
    	}, 4000);

	}

	hitEnemy(projectile, enemy) {
		projectile.destroy();
		
		var explosionSprite1 = this.add.sprite(enemy.x, enemy.y, "explosion");
		explosionSprite1.setScale(15);
    	explosionSprite1.play("explode");
    	this.explosionSound.play();


		this.score+=15;
		this.scoreFormated = this.zeroPad(this.score, 6);
		this.scoreLabel.text = "SCORE "+ this.scoreFormated;
		//I want to change this to not just be endless garbage
		this.resetShipPos(enemy);

	}

	spaceBarManager(){
		if (this.input.keyboard.checkDown(this.spacebar, 500)) {
		    if (!this.spacebarHeldDown) {
		        this.spacebarHeldDown = true;
		        this.shootBeam();
		    }
		    } else {
		        this.spacebarHeldDown = false;
		    }
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
			this.shootBeam();
		}
	}

	behemothEmerge(){
		this.comingSound.play();
		this.moveBehemothToY(this.game.config.height-50);
		this.time.delayedCall(4000, function() {
		    this.tweens.add({
		        targets: this.b_ship,
		        scaleX: .5, // End scale (full size)
		        scaleY: .5,
		        duration: 3000, // Duration of the animation in milliseconds
		        ease: 'Linear',
		        // No onComplete function here
		    });
		}, [], this);

	}



	waveManager() {
    // Create a flag to check if the Behemoth is currently active
        let behemothActive = false;
        // Set up a timer to run every 2 minutes (120,000 milliseconds)
        this.time.addEvent({
     
    
            delay: 120000,
            callback: () => {
                if (behemothActive) {
                    // If the Behemoth is active, dismiss it
                    this.behemothDismiss();
                    behemothActive = false;
                } else {
                    // If the Behemoth is not active, make it emerge
                    this.behemothEmerge();
                    behemothActive = true;

                    // Set a timer to automatically dismiss the Behemoth after 30 seconds
                    this.time.addEvent({
                        delay: 60000, // 30,000 milliseconds (30 seconds)
                        callback: () => {
                            this.behemothDismiss();
                            behemothActive = false;
                        },
                    });
                }
            },
            callbackScope: this,
            loop: true,
        });
    }

	behemothDismiss() {
	this.leavingSound.play();
    this.tweens.add({
        targets: this.b_ship,
        scaleX: 0.2, // Start scale (smaller size)
        scaleY: 0.2,
        duration: 2000, // Duration of the animation in milliseconds
        ease: 'Linear',
        onComplete: function () {
            // Animation complete, move the sprite to y = 4000
            this.moveBehemothToY(3000);
        },
        callbackScope: this,
    });
}

	moveBehemothToY(y) {
	    this.tweens.add({
	        targets: this.b_ship,
	        y: y,
	        duration: 4000, // Duration to reach the new Y position
	        ease: 'Linear',
	        onComplete: function () {
	            // Animation complete, you can perform additional actions if needed
	        },
	        callbackScope: this,
	    });
	}

	create() {
		//this.scale.scaleMode = Phaser.Scale.FIT;
	    //this.scale.pageAlignHorizontally = true;
	    //this.scale.pageAlignVertically = true;
	    //this.scale.refresh();
		
		window.addEventListener("deviceorientation", this.handleOrientation, true);

		this.is_alive = true;
		console.log(this.is_alive);
		
		//this.background.setOrigin(960,540);

		this.background = this.add.image(this.game.config.width/2, this.game.config.height/2,"background");

		var graphics = this.add.graphics();
		graphics.fillStyle(0x000000, 1);
		graphics.beginPath();
		graphics.moveTo(0,0);
		graphics.lineTo(0, 0);
		graphics.lineTo(this.game.config.width,0);
		graphics.lineTo(this.game.config.width,60);
		graphics.lineTo(0, 60);
		graphics.lineTo(0, 0);
		graphics.closePath();
		graphics.fillPath();



		this.score = 0;

		this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE  000000", 40);

		//enable physics
		this.p_ship = this.physics.add.sprite(this.game.config.width/2, this.game.config.height/2, 'playership');
		this.physics.add.existing(this.p_ship);

		this.b_ship = this.physics.add.sprite(this.game.config.width/2, 3000, 'behemoth');
		this.physics.add.existing(this.b_ship);
		this.b_ship.setScale(.5);

		this.p_ship.setScale(.09);
		
		this.p_ship.setInteractive({ draggable: true });
		this.p_ship.on('drag', (pointer, dragX, dragY) => {
		    this.p_ship.x = dragX;
		    this.p_ship.y = dragY;
		});
		this.input.dragDistanceThreshold = 5;



		let dragDirection = null;

	        this.input.on('dragstart', () => {

	            dragDirection = null;

	        });

	        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
	        	if (is_alive){
			    if (!dragDirection) {
			        if (Math.abs(pointer.velocity.x) > Math.abs(pointer.velocity.y)) {
			            dragDirection = 'horizontal';
			        } else {
			            dragDirection = 'vertical';
			        }
			    }

			    if (dragDirection === 'horizontal') {
			        gameObject.x = dragX;
			    } else if (dragDirection === 'vertical') {
			        gameObject.y = dragY;
			    }
			}
			});


	        this.input.on('dragend', () => {

	            dragDirection = null;

	        });
	    





		this.e_ship = this.add.image(800, 0, "enemyship");
		this.e_ship2 = this.add.image(300, 0, "enemyship");
		this.e_ship3 = this.add.image(70, 0, "enemyship");
		this.e_ship4 = this.add.image(50, 0, "enemyship");

		this.e_ship.setScale(.04);
		this.e_ship2.setScale(.02);
		this.e_ship3.setScale(.02);
		this.e_ship4.setScale(.02);


		this.e_ship.setInteractive();
		this.e_ship2.setInteractive();
		this.e_ship3.setInteractive();
		this.e_ship4.setInteractive();


		this.enemies = this.physics.add.group();
		this.enemies.add(this.e_ship);
		this.enemies.add(this.e_ship2);
		this.enemies.add(this.e_ship3);
		this.enemies.add(this.e_ship4);
		




		this.anims.create({
			key: "explode",
			frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }),
			frameRate: 20,
			repeat: 0,
			hideOnComplete: true,

		})

		//this.powerUpsd = this.physics.add.group();
		//var powerUpd = this.physics.add.sprite(16,16, "power-up");
		//this.powerUpsd.add(powerUpd);
		//powerUpd.setRandomPosition(0,0, 1920, 1080);
		//powerUpd.setScale(5);

		this.powerUps = this.physics.add.group();
		/*
		var maxObjects = 4;
		for (var i = 0; i <= maxObjects; i++) {
			var powerUp = this.physics.add.sprite(16,16, "power-up");
			this.powerUps.add(powerUp);
			powerUp.setRandomPosition(20,20, 1900, 1060);
			powerUp.setScale(5);
			if (Math.random() > 0.5) {
				powerUp.play("red");
			} else {
				powerUp.play("gray");
			}
			powerUp.setVelocity(20, 20);
			powerUp.setCollideWorldBounds(true);
			powerUp.setBounce(1);

			}
		*/



		//this.input.on('gameobjectdown', this.destroyShip, this);

		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.p_ship.setCollideWorldBounds(true);
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		//physics rules in objects interacting with eachoter
		this.projectiles = this.add.group();
		this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
			projectile.destroy();
		});
		this.physics.add.overlap(this.p_ship, this.powerUps, this.pickPowerUp, null, this);


		this.physics.add.overlap(this.p_ship, this.enemies, this.hurtPlayer, null, this);

		this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

		this.beamSound = this.sound.add("audio_beam");
		this.explosionSound = this.sound.add("audio_explosion");
		this.pickupSound = this.sound.add("audio_pickup");
		this.comingSound = this.sound.add("coming");
		this.leavingSound = this.sound.add("leaving");
		this.mainmenuSound = this.sound.add("mainmenu");
		this.hornSound = this.sound.add("horn");

		this.music = this.sound.add("music");
		var musicConfig = {
			mute: false,
			volume: 1.4,
			rate: 1,
			detune: 0,
			seek:0,
			loop: false,
			delay: 0,
		}

		this.music.play(musicConfig);
		this.beamCooldown = false;
		this.spacebarHeldDown = false;

		var firstTime = true;
		this.behemothEmerge();
		this.time.addEvent({
            delay: 20000,
            callback: () => {
            	this.behemothDismiss();
			}
		});

	



	}
	update(){
		this.moveShip(this.e_ship,2.5);
		this.moveShip(this.e_ship2,2.8);
		this.moveShip(this.e_ship3,2.9);
		this.moveShip(this.e_ship4,3);


		//this.handleOrientation();
		this.movePlayerManager();
		this.shootBeam();
		for(var i = 0; i< this.projectiles.getChildren().length; i++){
			var beam = this.projectiles.getChildren()[i];
			beam.update();
		}
		this.waveManager();
	}
}

