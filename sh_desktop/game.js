var gameSettings = {
		playerSpeed: 200,
	}


window.onload = function() {



	var config = {
		parent: 'iframe-container',
		width: 1280,
		height: 720,
		backgroundColor: 0x000000,
		scene: [scene1, scene2],
		pixelArt: true,
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}

		}

	}
		

	var game = new Phaser.Game(config);


	
}