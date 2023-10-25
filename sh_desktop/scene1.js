class scene1 extends Phaser.Scene {

	constructor() {
		super("bootGame");
	}




	zeroPad(number, size) {
		var stringNumber = String(number);
		while(stringNumber.length < (size || 2)){
			stringNumber = "0" + stringNumber;
		}
		return stringNumber;
	}



	preload(){
		//is it finding

		
		this.loadingText = this.add.text(
	        this.game.config.width / 2,
	        this.game.config.height / 2,
	        'Loading...',
	        {
	            fontSize: '24px',
	            fill: '#fff',
	        }
	    );
	    this.loadingText.setOrigin(0.5);

		this.load.image("background", "../assets/images/pixelhouston.png");
		this.load.image("titlescreen", "../assets/images/savehouston.png");
		this.load.image("play", "../assets/images/Play.png");
		this.load.image("playership", "../assets/images/player_ship.png");
		this.load.image("enemyship", "../assets/images/blob.png");
		this.load.image("behemoth", "../assets/images/behemoth.png")
		this.load.image("plane", "../assets/images/pixelplane.png")
		this.load.image("chaser", "../assets/images/chaseship.png")


		this.load.spritesheet("explosion", "../assets/spritesheets/explosion.png", {
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.spritesheet("power-up", "../assets/spritesheets/power-up.png",{
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.spritesheet("beam", "../assets/spritesheets/beam.png",{
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.bitmapFont("pixelFont", "../assets/font/font.png", "../assets/font/font.xml" );
		this.load.audio("audio_beam", ["../assets/sounds/beam.mp3"]);
		this.load.audio("audio_explosion", ["../assets/sounds/explosion.mp3"]);
		this.load.audio("audio_pickup", ["../assets/sounds/pickup.mp3"]);
		this.load.audio("music", ["../assets/sounds/mainmusic.mp3"]);
		this.load.audio("leaving", ["../assets/sounds/leaving.mp3"])
		this.load.audio("coming", ["../assets/sounds/coming.mp3"])
		this.load.audio("horn", ["../assets/sounds/sadhorn.mp3"])
		this.load.audio("mainmenu", ["../assets/sounds/mainmenu.mp3"])


		
	}









	create() {

		this.scale.scaleMode = Phaser.Scale.FIT;
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;
	    this.scale.refresh();


		

		this.mainmenu = this.sound.add("mainmenu");
		this.mainmenu.play();
		this.background = this.add.image(this.game.config.width/2, this.game.config.height/2,"titlescreen");

		this.background.setScale(.8);
		
		this.scoreLabel1 = this.add.bitmapText(70, 400, "pixelFont", "HIGH SCORE  000000", 80);
		this.scoreLabel1.setTint(0xffffff);

		if (localStorage.getItem("highscore") === null) {
		    localStorage.setItem("highscore", 0);
		}
		this.scoreFormated1 = this.zeroPad(localStorage.getItem("highscore"), 6);
		this.scoreLabel1.text = "HIGH SCORE "+ this.scoreFormated1;

		
		this.plane = this.add.image(-100, 350, "plane");
		this.plane.setScale(.4);
	    this.tweens.add({
	        targets: this.plane,
	        x: this.game.config.width + 100, 
	        duration: 8500, 
	        ease: 'Linear',
	        repeat: -1, 
	        yoyo: false, 
	    });
	    this.chase = this.add.image(-800, 230, "chaser");
		this.chase.setScale(.23);
	    this.tweens.add({
	        targets: this.chase,
	        x: this.game.config.width + 300, 
	        duration: 8500, 
	        ease: 'Linear',
	        repeat: -1, 
	        yoyo: false, 
	    });




		this.playButton = this.add.image(200,550, "play");

		this.playButton.setInteractive();

		this.playButton.on("pointerover", ()=>{
			this.playButton.setScale(1.3);
		});
		this.playButton.on("pointerout", ()=>{
			this.playButton.setScale(1.0);
		});
		this.playButton.on("pointerup", ()=>{
			this.mainmenu.stop()
			this.scene.start("playGame");
		});





		this.anims.create({
			key: "red",
			frames: this.anims.generateFrameNumbers("power-up", {
				start: 0,
				end: 1,
			}),
			frameRate: 20,
			repeat: -1,
		});

		this.anims.create({
			key: "gray",
			frames: this.anims.generateFrameNumbers("power-up", {
				start: 2,
				end: 3,
			}),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: "beam_anim",
			frames: this.anims.generateFrameNumbers("beam"),
			frameRate: 20,
			repeat: -1


		})



			


		}

	}



