const canvas = document.querySelector("canvas"); //grabing the canvas element and storing it in cancas var
const context = canvas.getContext("2d"); //responsible for drowing

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height); //the canvas area

const gravity = 0.7;
class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      width: 100,
      height: 50,
    };

    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack box draw
    if (this.isAttacking) {
      context.fillStyle = "green";
      context.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
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

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate); //call its self
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
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
