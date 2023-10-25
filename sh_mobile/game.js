var gameSettings = {
		playerSpeed: 200,
	}


window.onload = function() {



	var config = {
		//parent: 'iframe-container',
		width: 320,
		height: 480,
	    scale: {
		    mode: Phaser.Scale.RESIZE,
		    parent: 'iframe-container2', 
		    autoCenter: Phaser.Scale.CENTER_BOTH,
		},
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