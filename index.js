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

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: {
    x: 0,
    y: 0,
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
  player.update();
  enemy.update();

  //when we are looping throug the animation this if statement listens if the key is pressed or not

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player key movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) && //collision detection
    player.isAttacking
  ) {
    //player attack
    player.isAttacking = false;
    enemy.health -= 10;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  //collision when enemy attacks
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) && //collision detection
    enemy.isAttacking
  ) {
    //attack
    enemy.isAttacking = false;
    player.health -= 10;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //end the game based on health

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", (event) => {
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
      enemy.isAttacking = true;
      break;
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
