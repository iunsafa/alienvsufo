class GalleryShooter extends Phaser.Scene {
  constructor() {
      super("galleryShooter");

      // Initialize a class variable "my" which is an object.
      // The object has two properties, both of which are objects
      //  - "sprite" holds bindings (pointers) to created sprites
      //  - "text"   holds bindings to created bitmap text objects
      this.my = {sprite: {}, text: {}};

      // Create a property inside "sprite" named "bullet".
      // The bullet property has a value which is an array.
      // This array will hold bindings (pointers) to bullet sprites
      this.my.sprite.bullet = [];   
      this.maxBullets = 3;           // Don't create more than this many bullets

      this.my.sprite.bullet2 = [];

       // State variables for hippo movement pattern
       this.hippoState = {
        xDirection: 1, // 1 for right, -1 for left
        yDirection: 1, // 1 for down, -1 for up
      };

      
      this.myScore = 0;       // record a score as a class variable
      // More typically want to use a global variable for score, since
      // it will be used across multiple scenes
      this.myHealth = 100;

      this.highScore = localStorage.getItem("highScore") || 0;
  }

  preload() {
      this.load.setPath("./assets/");
      this.load.image(`cow`, "cow.png");
      this.load.image("heart", "heart.png");
      this.load.image("hippo", "hippo.png");
      this.load.image("beige", "shipBeige_manned.png");
      this.load.image("beigeLaser", "laserBeige1.png");
      this.load.image("green", "shipGreen_manned.png");
      this.load.image("greenLaser", "laserGreen1.png");
      this.load.image("pink", "shipPink_manned.png");
      this.load.image("pinkLaser", "laserPink1.png");
      this.load.image("yellow", "shipYellow_manned.png");
      this.load.image("yellowLaser", "laserYellow1.png");

      // For animation
      this.load.image("whitePuff00", "whitePuff00.png");
      this.load.image("whitePuff01", "whitePuff01.png");
      this.load.image("whitePuff02", "whitePuff02.png");
      this.load.image("whitePuff03", "whitePuff03.png");

      // Load the Kenny Rocket Square bitmap font
      // This was converted from TrueType format into Phaser bitmap
      // format using the BMFont tool.
      // BMFont: https://www.angelcode.com/products/bmfont/
      // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
      this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

      // Sound asset from the Kenny Music Jingles pack
      // https://kenney.nl/assets/music-jingles
      this.load.audio("dadada", "pop.mp3");
  }

  create() {
      let my = this.my;

      my.sprite.cow = this.add.sprite(game.config.width/2, game.config.height - 40, "cow");
      my.sprite.cow.setScale(0.4);

      my.sprite.hippo = this.add.sprite(game.config.width/2, 80, "beige");
      my.sprite.hippo.setScale(0.5);
      my.sprite.hippo.scorePoints = 25;

      my.sprite.hippo2 = this.add.sprite(game.config.width/2, 80, "green");
      my.sprite.hippo2.setScale(0.5);
      my.sprite.hippo2.scorePoints = 25;

      my.sprite.hippo3 = this.add.sprite(game.config.width/2, 80, "pink");
      my.sprite.hippo3.setScale(0.5);
      my.sprite.hippo3.scorePoints = 25;

      my.sprite.hippo4 = this.add.sprite(game.config.width/2, 80, "yellow");
      my.sprite.hippo4.setScale(0.5);
      my.sprite.hippo4.scorePoints = 25;

      // Notice that in this approach, we don't create any bullet sprites in create(),
      // and instead wait until we need them, based on the number of space bar presses


      // Create key objects
      this.left = this.input.keyboard.addKey("A");
      this.right = this.input.keyboard.addKey("D");
      this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      // Set movement speeds (in pixels/tick)
      this.playerSpeed = 15;
      this.bulletSpeed = 10;

      // update HTML description
      document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2><br>A: left // D: right // Space: fire/emit // S: Restart Game'

      // Put score on screen
      my.text.score = this.add.bitmapText(0, 0, "rocketSquare", "Score " + this.myScore);
      my.text.score.setScale(0.75);
      my.text.health = this.add.bitmapText(0, 50, "rocketSquare", "Health " + this.myHealth);
      my.text.health.setScale(0.75);
      my.text.hscore = this.add.bitmapText(0, 100, "rocketSquare", "High Score " + this.highScore);
      my.text.hscore.setScale(0.75);


    // Set up a timer to periodically emit bullets from the hippo
    this.hippoBulletTimer = this.time.addEvent({
      delay: 300, // Adjust this value to control the frequency of bullet emission (in milliseconds)
      loop: true, // Repeat the timer indefinitely
      callback: this.emitHippoBullet,
      callbackScope: this // Ensure the callback is called within the scope of this scene
  });
    // Set up a timer to periodically emit bullets from hippo2 (similar to hippo)
    this.hippo2BulletTimer = this.time.addEvent({
      delay: 300, // Adjust this value to control hippo2's bullet emission frequency
      loop: true,
      callback: this.emitHippo2Bullet,
      callbackScope: this // Ensure the callback is called within the scope of this scene
    });
    // Set up a timer to periodically emit bullets from hippo2 (similar to hippo)
    this.hippo3BulletTimer = this.time.addEvent({
      delay: 1000, // Adjust this value to control hippo2's bullet emission frequency
      loop: true,
      callback: this.emitHippo3Bullet,
      callbackScope: this // Ensure the callback is called within the scope of this scene
    });
    this.hippo4BulletTimer = this.time.addEvent({
      delay: 50, // Adjust this value to control hippo2's bullet emission frequency
      loop: true,
      callback: this.emitHippo4Bullet,
      callbackScope: this // Ensure the callback is called within the scope of this scene
    });
   

  }

  update() {
      let my = this.my;

      this.moveHippo(my.sprite.hippo);
      this.moveHippo(my.sprite.hippo2);
      this.moveHippo(my.sprite.hippo3);
      this.moveHippo(my.sprite.hippo4);

      // Moving left
      if (this.left.isDown) {
          // Check to make sure the sprite can actually move left
          if (my.sprite.cow.x > (my.sprite.cow.displayWidth/2)) {
              my.sprite.cow.x -= this.playerSpeed;
          }
      }

      // Moving right
      if (this.right.isDown) {
          // Check to make sure the sprite can actually move right
          if (my.sprite.cow.x < (game.config.width - (my.sprite.cow.displayWidth/2))) {
              my.sprite.cow.x += this.playerSpeed;
          }
      }

      // Check for bullet being fired
      if (Phaser.Input.Keyboard.JustDown(this.space)) {
          // Are we under our bullet quota?
          if (my.sprite.bullet.length < this.maxBullets) {
              my.sprite.bullet.push(this.add.sprite(
                  my.sprite.cow.x, my.sprite.cow.y-(my.sprite.cow.displayHeight/2), "heart")
              );
          }
      }

      // Remove all of the bullets which are offscreen
      // filter() goes through all of the elements of the array, and
      // only returns those which **pass** the provided test (conditional)
      // In this case, the condition is, is the y value of the bullet
      // greater than zero minus half the display height of the bullet? 
      // (i.e., is the bullet fully offscreen to the top?)
      // We store the array returned from filter() back into the bullet
      // array, overwriting it. 
      // This does have the impact of re-creating the bullet array on every 
      // update() call. 
      my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
      my.sprite.bullet2 = my.sprite.bullet2.filter((bullet2) => bullet2.y > -(bullet2.displayHeight/2));

      // Check for collision with the hippo
      for (let bullet of my.sprite.bullet) {
          if (this.collides(my.sprite.hippo, bullet)) {
              // start animation
              
              // clear out bullet -- put y offscreen, will get reaped next update
              bullet.y = -100;
              my.sprite.hippo.visible = false;
              my.sprite.hippo.x = -100;
              // Update score
              this.myScore += my.sprite.hippo.scorePoints;
              this.updateScore();
              // Play sound
              this.sound.play("dadada", {
                  volume: 1   // Can adjust volume using this, goes from 0 to 1
              });
              // Have new hippo appear after end of animation
            
                  this.my.sprite.hippo.visible = true;
                  my.sprite.hippo.x = Math.random() * game.config.width;
                  my.sprite.hippo.y = -my.sprite.hippo.displayHeight / 2;
             

          }
          if (this.collides(my.sprite.hippo2, bullet)) {
              // start animation
              
              // clear out bullet -- put y offscreen, will get reaped next update
              bullet.y = -100;
              my.sprite.hippo2.visible = false;
              my.sprite.hippo2.x = -100;
              // Update score
              this.myScore += my.sprite.hippo2.scorePoints;
              this.updateScore();
              // Play sound
              this.sound.play("dadada", {
                  volume: 1   // Can adjust volume using this, goes from 0 to 1
              });
              // Have new hippo appear after end of animation
            
                  this.my.sprite.hippo2.visible = true;
                  my.sprite.hippo2.x = Math.random() * game.config.width;
                  my.sprite.hippo2.y = -my.sprite.hippo2.displayHeight / 2;
             

          }
          if (this.collides(my.sprite.hippo3, bullet)) {
            // start animation
            
            // clear out bullet -- put y offscreen, will get reaped next update
            bullet.y = -100;
            my.sprite.hippo3.visible = false;
            my.sprite.hippo3.x = -100;
            // Update score
            this.myScore += my.sprite.hippo3.scorePoints;
            this.updateScore();
            // Play sound
            this.sound.play("dadada", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            // Have new hippo appear after end of animation
          
                this.my.sprite.hippo3.visible = true;
                my.sprite.hippo3.x = Math.random() * game.config.width;
                my.sprite.hippo3.y = -my.sprite.hippo3.displayHeight / 2;
           

        }
        if (this.collides(my.sprite.hippo4, bullet)) {
          // start animation
          
          // clear out bullet -- put y offscreen, will get reaped next update
          bullet.y = -100;
          my.sprite.hippo4.visible = false;
          my.sprite.hippo4.x = -100;
          // Update score
          this.myScore += my.sprite.hippo4.scorePoints;
          this.updateScore();
          // Play sound
          this.sound.play("dadada", {
              volume: 1   // Can adjust volume using this, goes from 0 to 1
          });
          // Have new hippo appear after end of animation
        
              this.my.sprite.hippo4.visible = true;
              my.sprite.hippo4.x = Math.random() * game.config.width;
              my.sprite.hippo4.y = -my.sprite.hippo4.displayHeight / 2;
         

      }
      }

      for (let bullet2 of my.sprite.bullet2) {
        if (this.collides(my.sprite.cow, bullet2)) {
          bullet2.y = -100;
          this.myHealth -= 10;
          this.updateHealth();
        }
      }
     for (let playerBullet of my.sprite.bullet) {
        for (let hippoBullet of my.sprite.bullet2) {
            if (this.collides(playerBullet, hippoBullet)) {
                playerBullet.y = -100;
                hippoBullet.y = -100;
            }
        }
    }

      // Make all of the bullets move
      for (let bullet of my.sprite.bullet) {
          bullet.y -= this.bulletSpeed;
      }
      for (let bullet2 of my.sprite.bullet2) {
        bullet2.y += this.bulletSpeed + 2;
    }

    if(this.myScore >= 2000){
      this.scene.start("victoryScene");
      if (this.myScore > this.highScore) {

        this.highScore = this.myScore;
      
        localStorage.setItem("highScore", this.highScore);
      }
    }
    if(this.myHealth <= 0){
      this.scene.start("defeatScene");
    }


  }

  // A center-radius AABB collision check
  collides(a, b) {
      if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
      if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
      return true;
  }

  updateScore() {
      let my = this.my;
      my.text.score.setText("Score " + this.myScore);
  }

  updateHealth() {
      let my = this.my;
      my.text.health.setText("Health " + this.myHealth);
  }

  moveHippo(hippo) {
    let directionChangeProbability = 0.0001; 
    hippo.y += this.playerSpeed - 8;
   
    if (hippo.y > game.config.height + (hippo.displayHeight / 2)) {
        // Reset its position to the top
        hippo.y = -hippo.displayHeight / 2;
        
        hippo.x = Math.random() * game.config.width;
    }

   
    if (Math.random() < directionChangeProbability) {
        // Randomize the x-direction
        let newDirection = Math.random() < 0.5 ? -1 : 1;
        // Change the x-direction
        this.hippoState.xDirection = newDirection;
    }

    hippo.x += (this.playerSpeed - 8) * this.hippoState.xDirection;

    if (hippo.x < 0 || hippo.x > game.config.width) {
  
        this.hippoState.xDirection *= -1;
    }
}
  
  emitHippoBullet() {
    let my = this.my;
    
    // Create a bullet sprite and add it to the array
    my.sprite.bullet2.push(this.add.sprite(
        my.sprite.hippo.x, 
        my.sprite.hippo.y+(my.sprite.hippo.displayHeight/2), // Adjust the y position to start from the hippo's top
        "beigeLaser").setScale(0.25)
    );

}

  emitHippo2Bullet() {
    let my = this.my;

    // Create a bullet sprite and add it to hippo2's bullet array (assuming you want a separate array)
    my.sprite.bullet2.push(this.add.sprite(
      my.sprite.hippo2.x, 
      my.sprite.hippo2.y + (my.sprite.hippo2.displayHeight / 2), // Start from hippo2's top
      "greenLaser"
    ).setScale(0.25));
  }
  emitHippo3Bullet() {
    let my = this.my;

    // Create a bullet sprite and add it to hippo2's bullet array (assuming you want a separate array)
    my.sprite.bullet2.push(this.add.sprite(
      my.sprite.hippo3.x, 
      my.sprite.hippo3.y + (my.sprite.hippo3.displayHeight / 2), // Start from hippo2's top
      "pinkLaser"
    ).setScale(1));
  }
  emitHippo4Bullet() {
    let my = this.my;

    // Create a bullet sprite and add it to hippo2's bullet array (assuming you want a separate array)
    my.sprite.bullet2.push(this.add.sprite(
      my.sprite.hippo4.x, 
      my.sprite.hippo4.y + (my.sprite.hippo4.displayHeight / 2), // Start from hippo2's top
      "yellowLaser"
    ).setScale(0.25));
  }

  init_game() {
    // Reset all game variables to their initial conditions
    this.myScore = 0;
    this.myHealth = 100;

    // Reset player and hippo positions
    this.my.sprite.cow.x = game.config.width / 2;
    this.my.sprite.cow.y = game.config.height - 40;

    this.my.sprite.hippo.x = game.config.width / 2;
    this.my.sprite.hippo.y = 80;

    this.my.sprite.hippo2.x = game.config.width / 2;
    this.my.sprite.hippo2.y = 80;

    this.my.sprite.hippo3.x = game.config.width / 2;
    this.my.sprite.hippo3.y = 80;

    this.my.sprite.hippo4.x = game.config.width / 2;
    this.my.sprite.hippo4.y = 80;

    // Reset hippo movement state
    this.hippoState.xDirection = 1;
    this.hippoState.yDirection = 1;

    // Reset bullet arrays
    this.my.sprite.bullet = [];
    this.my.sprite.bullet2 = [];

    // Reset score and health text
    this.updateScore();
    this.updateHealth();
}

}
       