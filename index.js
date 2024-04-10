const canvas = document.querySelector("canvas"); //grabing the canvas element and storing it in cancas var
const context = canvas.getContext("2d"); //responsible for drowing

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height); //the canvas area

const gravity = 0.7;
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 127,
  },
  imageSrc: "/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  //create player
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "/samuraiMack/Idle.png",
  framesMax: 8, //number of frame
  scale: 2.5,
  offset: {
    x: 210,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "/samuraiMack/Run.png",
      framesMax: 8,
      image: new Image(),
    },
    jump: {
      imageSrc: "/samuraiMack/Jump.png",
      framesMax: 2,
      // image: new Image(),
    },

    fall: {
      imageSrc: "/samuraiMack/Fall.png",
      framesMax: 2,
    },

    attack1: {
      imageSrc: "/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },

  imageSrc: "/kenji/Idle.png",
  framesMax: 4, //number of frame
  scale: 2.5,
  offset: {
    x: 210,
    y: 168,
  },
  sprites: {
    idle: {
      imageSrc: "/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "/kenji/Run.png",
      framesMax: 8,
      image: new Image(),
    },
    jump: {
      imageSrc: "/kenji/Jump.png",
      framesMax: 2,
      // image: new Image(),
    },

    fall: {
      imageSrc: "/kenji/Fall.png",
      framesMax: 2,
    },

    attack1: {
      imageSrc: "/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 175,
    height: 50,
  },
});

enemy.draw();

console.log(player);

const keys = {
  a: {
    pressed: false,
  },

  d: {
    pressed: false,
  },

  w: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate); //call its self
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  background.update(); //this display the background
  shop.update();
  player.update();
  enemy.update();

  //when we are looping throug the animation this if statement listens if the key is pressed or not

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player key movement
  player.switchSprite("idle");
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  }
  //jump
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  //jump

  if (player.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }
  //detect for collision & enemy gers hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) && //collision detection
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    //player attack
    enemy.takeHit();
    player.isAttacking = false;

    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  //if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //collision when enemy attacks
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) && //collision detection
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    //attack
    player.takeHit();
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }
  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    //the//sword ataack
    enemy.isAttacking = false;
  }

  //end the game based on health

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    //if the characte is not dead run the envent listener

    switch (event.key) {
      //the d key moves it right
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      //the a key moves it left
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      //the w key moves it up(jump)
      case "w":
        player.velocity.y = -20;

        break;
      case " ":
        player.attack(); //player attack
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      //arrow
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      //the a key moves it left
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      //the w key moves it up(jump)
      case "ArrowUp":
        enemy.velocity.y = -20;

        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;

    case "w":
      keys.w.pressed = false;
      lastKey = "w";
      break;

    //keyup arrow
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    // case "ArrowUp":
    //   keys.ArrowUp.pressed = false;
    //   lastKey = "w";
    //   break;
  }
});
