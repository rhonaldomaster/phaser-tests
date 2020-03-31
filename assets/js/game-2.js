var game = null;
var player = null;
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

function preload() {
  this.load.image('fondo', 'assets/img/fondobig.jpg');
  this.load.spritesheet('granjero', 'assets/img/personaje_run.png', { frameWidth: 150, frameHeight: 150 });
  this.load.image('ground', 'assets/img/platform.png');
}

function create() {
  this.add.image(590, 363, 'fondo');
  iniciarJugador(this);
  cursors = this.input.keyboard.createCursorKeys();
  platforms = this.physics.add.staticGroup();
}

function update() {
  let velocityX = 0;
  if (cursors.left.isDown) {
    velocityX = -160;
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    velocityX = 160;
    player.anims.play('right', true);
  } else {
    player.anims.play('turn');
  }
  player.setVelocityX(velocityX);

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function init() {
  var config = getGameConfig();
  game = new Phaser.Game(config);
}

init();