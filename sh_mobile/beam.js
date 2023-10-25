class Beam extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        

        super(scene, x, y, "beam");
        scene.add.existing(this);
        scene.projectiles.add(this);

        this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;
        this.setScale(2);

	}
	update(){
		if(this.y < 10) {
			this.destroy();
		}
	}


}