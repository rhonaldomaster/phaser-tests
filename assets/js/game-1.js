const Game = (function () {
  let handler = null;
  let platforms = null;
  let player = null;
  let cursors = null;
  let stars = null;
  let score = 0;
  let scoreText = null;
  let bombs = null;

  const initPlatforms = function (game) {
    platforms = game.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
  };

  const initCharacter = function (game) {
    player = game.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    game.anims.create({
      key: 'left',
      frames: game.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    game.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    game.anims.create({
      key: 'right',
      frames: game.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  };

  const setCursorActions = function () {
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
  };

  const addStars = function (game) {
    stars = game.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
  };

  const collectStar = function (player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      let xPosition = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      let bomb = bombs.create(xPosition, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
  };

  const hitBomb = function (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  };

  const preload = function () {
    this.load.image('sky', 'assets/img/sky.png');
    this.load.image('ground', 'assets/img/platform.png');
    this.load.image('star', 'assets/img/star.png');
    this.load.image('bomb', 'assets/img/bomb.png');
    this.load.spritesheet('dude',
      'assets/img/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );
  };

  const create = function () {
    this.add.image(400, 300, 'sky');
    initPlatforms(this);
    initCharacter(this);
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();

    addStars(this);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
  };

  const update = function () {
    setCursorActions();
  };

  const getGameConfig = function () {
    return {
      parent: 'game-container',
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };
  };

  const init = function () {
    const config = getGameConfig();
    handler = new Phaser.Game(config);
  };

  return {
    init: init
  };
})();

Game.init();