class StartScene extends Phaser.Scene {
  constructor() {
    super("startScene");
  }

  preload() {
  
  }

  create() {
    // Get the center coordinates of the screen
    this.nextScene = this.input.keyboard.addKey("S");
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Add text to the center of the screen
    this.add.text(centerX, centerY, "Welcome to Animals vs UFOS \n To Win, Get 2000 points by destroying the UFOs \n and surviving by dodging their lasers\n You can shoot their lasers and destroy them as well.\n See below for commands.", {
      fontFamily: 'Times, serif',
      fontSize: 25,
      align: 'center', 
      wordWrap: {
          width: 1000 
      }
    }).setOrigin(0.5);
    document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2><br>A: left // D: right // Space: fire/emit(max 3 bullets at a time) // S: Start Game'
  }

  update() {
    // Update logic if needed
    if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
      this.scene.start("galleryShooter");

    }
  }
}