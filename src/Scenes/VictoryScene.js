class VictoryScene extends Phaser.Scene {
  constructor() {
    super("victoryScene");
  }

  preload() {
    // Preload assets if needed
  }

  create() {
    // Get the center coordinates of the screen
    this.nextScene = this.input.keyboard.addKey("S");
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Add text to the center of the screen
    this.add.text(centerX, centerY, "Victory!", {
      fontFamily: 'Times, serif',
      fontSize: 50,
      align: 'center', 
      wordWrap: {
          width: 200 
      }
    }).setOrigin(0.5);
  }

  update() {
    // Update logic if needed
    if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
      this.scene.start("galleryShooter");
      this.scene.get("galleryShooter").init_game();
    }
  }
}