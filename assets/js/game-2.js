var game = null;
var player = null;
var aliens = null;
var cursors = null;
var platforms = null;

function getGameConfig() {
  return {
    parent: 'game-container',
    type: Phaser.AUTO,
    width: 1179,
    height: 726,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
}

function iniciarJugador(game) {
  player = game.physics.add.sprite(100, 450, 'granjero');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  game.anims.create({
    key: 'left',
    frames: game.anims.generateFrameNumbers('granjero', { start: 0, end: 6 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: 'up',
    frames: [{ key: 'granjero', frame: 6 }],
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: 'down',
    frames: [{ key: 'granjero', frame: 6 }],
    frameRate: 10
  });

  game.anims.create({
    key: 'turn',
    frames: [{ key: 'granjero', frame: 6 }],
    frameRate: 20
  });

  game.anims.create({
    key: 'right',
    frames: game.anims.generateFrameNumbers('granjero', { start: 8, end: 12 }),
    frameRate: 10,
    repeat: -1
  });
}

function iniciarAliens(game) {
  var xPosition = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  aliens = game.physics.add.group({
    key: 'alien',
    repeat: 11,
    setXY: { x: xPosition, y: 400, stepX: 70 }
  });
  aliens.children.iterate(function (alien) {
    alien.setBounce(0.2);
    alien.setCollideWorldBounds(true);
    alien.setVelocity(Phaser.Math.Between(-200, 200), 20);
  });
}

function preload() {
  this.load.spritesheet('alien', 'assets/img/alien.png', { frameWidth: 68, frameHeight: 180 });
  this.load.image('fondo', 'assets/img/fondobig.jpg');
  this.load.spritesheet('granjero', 'assets/img/personaje_run.png', { frameWidth: 150, frameHeight: 150 });
}

function create() {
  this.add.image(590, 363, 'fondo');
  iniciarJugador(this);
  iniciarAliens(this);
  cursors = this.input.keyboard.createCursorKeys();
  platforms = this.physics.add.staticGroup();
  this.physics.add.collider(player, aliens, hitAlien, null, this);
}

function hitAlien(player, alien) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
}

function update() {
  let velocityX = 0;
  let velocityY = 0;
  if (cursors.left.isDown) {
    velocityX = -160;
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    velocityX = 160;
    player.anims.play('right', true);
  } else {
    player.anims.play('turn');
  }

  if (cursors.up.isDown) {
    velocityY = -160;
    player.anims.play('up', true);
  } else if (cursors.down.isDown) {
    velocityY = 160;
    player.anims.play('down', true);
  }
  player.setVelocityX(velocityX);
  player.setVelocityY(velocityY);
}

function init() {
  var config = getGameConfig();
  game = new Phaser.Game(config);
}

init();